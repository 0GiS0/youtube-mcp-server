import express, { RequestHandler } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { searchTools } from "./tools/searchTools.js";
import { searchPrompts } from "./prompts/searchPrompts.js";
import { resources } from "./resources/staticResources.js";
import { randomUUID } from "node:crypto";
import chalk from "chalk";

import * as dotenv from "dotenv";
import { metadataHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/metadata.js";
import {
  InvalidTokenError,
  ServerError,
} from "@modelcontextprotocol/sdk/server/auth/errors.js";
dotenv.config();

const PORT = process.env.PORT || 3002;
const ISSUER = process.env.ISSUER;

/********** Auth configuration *************/

const mcpMetadataRouter = (): RequestHandler => {
  const router = express.Router();

  router.use(
    "/.well-known/oauth-authorization-server",
    metadataHandler({
      resource: ISSUER || "",
      issuer: ISSUER,

      authorization_endpoint: new URL("/authorize", ISSUER).href,
      token_endpoint: new URL("/oauth/token", ISSUER).href,
      registration_endpoint: new URL("/oidc/register", ISSUER).href,

      response_types_supported: ["code"],
      code_challenge_methods_supported: ["S256"],

      token_endpoint_auth_methods_supported: ["client_secret_post"],
      grant_types_supported: ["authorization_code", "refresh_token"],
    })
  );

  return router;
};

const requireAuth = (): RequestHandler => {
  return async (req, res, next) => {
    try {
      console.log(chalk.yellow("🔐 [AUTH]"), chalk.white("Checking authentication"));
      
      const header = req.headers.authorization;
      if (!header) {
        console.log(chalk.red("❌ [AUTH]"), chalk.yellow("Missing Authorization header"));
        throw new InvalidTokenError("Missing Authorization header");
      }

      const [type, token] = header.split(" ");
      if (type.toLowerCase() !== "bearer" || !token) {
        console.log(chalk.red("❌ [AUTH]"), chalk.yellow("Invalid Authorization header format"));
        throw new InvalidTokenError(
          "Invalid Authorization header format, expected 'Bearer TOKEN'"
        );
      }

      console.log(chalk.green("✅ [AUTH]"), chalk.white("Token validation passed"));
      // Aquí debería validarse que el token es válido, que tiene los claims que se necesitan, etc.

      next();
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.log(chalk.red("🚫 [AUTH]"), chalk.yellow(`Token error: ${error.message}`));
        res.set(
          "WWW-Authenticate",
          `Bearer error="${error.errorCode}", error_description="${error.message}"`
        );
        res.status(401).json(error.toResponseObject());
      } else {
        console.error(chalk.red("❌ Unexpected error authenticating bearer token:"), chalk.yellow(error));
        res
          .status(500)
          .json(new ServerError("Internal Server Error").toResponseObject());
      }
    }
  };
};

/******** End Auth configuration *************/

// Create an Express application
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(chalk.gray(`[${timestamp}]`), chalk.blue(`${req.method}`), chalk.white(req.url), chalk.yellow(`from ${req.ip}`));
  next();
});

// Use JSON middleware to parse request bodies
app.use(express.json());

// Endpoint with metadata for OAuth
app.use(mcpMetadataRouter());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post("/mcp", requireAuth(), async (req, res) => {
  console.log(chalk.cyan("🚀 [POST /mcp]"), chalk.blue("Incoming request received"));
  
  // Check for existing session ID
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    console.log(chalk.green("♻️  [SESSION]"), chalk.yellow(`Reusing existing session: ${sessionId}`));
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    console.log(chalk.magenta("🆕 [INIT]"), chalk.blue("Creating new session and transport"));
    
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        console.log(chalk.green("✅ [SESSION]"), chalk.yellow(`Session initialized: ${sessionId}`));
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(chalk.red("🗑️  [CLEANUP]"), chalk.yellow(`Cleaning up session: ${transport.sessionId}`));
        delete transports[transport.sessionId];
      }
    };
    
    console.log(chalk.blue("🏗️  [SERVER]"), chalk.white("Creating MCP server instance"));
    const server = new McpServer({
      name: "remote-mcp-server",
      version: "2.0.0",
      capabilities: {
        resources: {
          subscribe: true, //whether the client can subscribe to be notified of changes to individual resources.
          listChanged: true, // whether the server will emit notifications when the list of available resources changes.
        },
      },
    });

    // ... set up server resources, tools, and prompts ...
    // Register the tools
    console.log(chalk.green("🔧 [TOOLS]"), chalk.white(`Registering ${searchTools.length} tools`));
    [...searchTools].forEach((tool) => {
      console.log(chalk.green("  ├─ 🛠️ "), chalk.cyan(tool.name), chalk.gray(`- ${tool.description}`));
      server.tool(tool.name, tool.description, tool.schema, tool.handler);
    });

    // Register prompts
    console.log(chalk.green("💬 [PROMPTS]"), chalk.white(`Registering ${searchPrompts.length} prompts`));
    searchPrompts.forEach((prompt) => {
      console.log(chalk.green("  ├─ 💭 "), chalk.cyan(prompt.name));
      server.registerPrompt(prompt.name, prompt.config, prompt.handler);
    });

    // Register static resources
    console.log(chalk.green("📦 [RESOURCES]"), chalk.white(`Registering ${resources.length} static resources`));
    resources.forEach((resource) => {
      console.log(chalk.green("  ├─ 📄 "), chalk.cyan(resource.name));
      server.registerResource(resource.name,resource.uri, resource.config, resource.handler)
    });

    // Connect to the MCP server
    console.log(chalk.blue("🔗 [CONNECT]"), chalk.white("Connecting server to transport"));
    await server.connect(transport);
  } else {
    // Invalid request
    console.log(chalk.red("❌ [ERROR]"), chalk.yellow("Invalid request - No valid session ID provided"));
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: null,
    });
    return;
  }

  // Handle the request
  console.log(chalk.cyan("⚡ [HANDLE]"), chalk.white("Processing request through transport"));
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  console.log(chalk.cyan(`🔄 [${req.method}]`), chalk.blue(`Session request for: ${sessionId || 'undefined'}`));
  
  if (!sessionId || !transports[sessionId]) {
    console.log(chalk.red("❌ [ERROR]"), chalk.yellow("Invalid or missing session ID"));
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  console.log(chalk.green("✅ [SESSION]"), chalk.white("Valid session found, handling request"));
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", requireAuth(), (req, res, next) => {
  console.log(chalk.magenta("📡 [SSE]"), chalk.blue("Server-to-client notifications endpoint"));
  handleSessionRequest(req, res);
});

// Handle DELETE requests for session termination
app.delete("/mcp", requireAuth(), (req, res, next) => {
  console.log(chalk.red("🔚 [DELETE]"), chalk.blue("Session termination request"));
  handleSessionRequest(req, res);
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(chalk.magenta("🎯 [STARTUP]"), chalk.white("=".repeat(60)));
  console.log(chalk.green("🎉 [SERVER READY]"), chalk.white(`Remote MCP Server v2.0.0`));
  console.log(chalk.green("🎉 [SERVER READY]"), chalk.white(`Server is running on`), chalk.blue.underline(`http://localhost:${PORT}/mcp`), chalk.yellow("🚀"));
  console.log(chalk.cyan("📋 [INFO]"), chalk.white("Available endpoints:"));
  console.log(chalk.green("  ├─ POST"), chalk.blue("/mcp"), chalk.gray("- Main MCP communication"));
  console.log(chalk.green("  ├─ GET "), chalk.blue("/mcp"), chalk.gray("- Server-to-client notifications (SSE)"));
  console.log(chalk.green("  └─ DELETE"), chalk.blue("/mcp"), chalk.gray("- Session termination"));
  console.log(chalk.magenta("🎯 [STARTUP]"), chalk.white("=".repeat(60)));
});
