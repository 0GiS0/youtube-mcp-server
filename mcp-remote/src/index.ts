import express, { RequestHandler } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { searchTools } from "./tools/searchTools.js";
import { searchPrompts } from "./prompts/searchPrompts.js";
import { youtubeResources } from "./resources/youtubeResources.js";
import { randomUUID } from "node:crypto";

import * as dotenv from "dotenv";
import { metadataHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/metadata.js";
import {
  InvalidTokenError,
  ServerError,
} from "@modelcontextprotocol/sdk/server/auth/errors.js";
dotenv.config();

const PORT = process.env.PORT || 3001;
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
      const header = req.headers.authorization;
      if (!header) {
        throw new InvalidTokenError("Missing Authorization header");
      }

      const [type, token] = header.split(" ");
      if (type.toLowerCase() !== "bearer" || !token) {
        throw new InvalidTokenError(
          "Invalid Authorization header format, expected 'Bearer TOKEN'"
        );
      }

      // TODO: add validation here if you need to verify access token

      next();
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        res.set(
          "WWW-Authenticate",
          `Bearer error="${error.errorCode}", error_description="${error.message}"`
        );
        res.status(401).json(error.toResponseObject());
      } else {
        console.error("Unexpected error authenticating bearer token:", error);
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

// Use JSON middleware to parse request bodies
app.use(express.json());

// Endpoint with metadata for OAuth
app.use(mcpMetadataRouter());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post("/mcp", requireAuth(), async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
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
        delete transports[transport.sessionId];
      }
    };
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
    [...searchTools].forEach((tool) => {
      server.tool(tool.name, tool.description, tool.schema, tool.handler);
    });

    // Register prompts
    searchPrompts.forEach((prompt) => {
      server.registerPrompt(prompt.name, prompt.config, prompt.handler);
    });

    // Register static resources
    youtubeResources.forEach((resource) => {
      server.registerResource(
        resource.name,
        resource.uri,
        resource.config,
        resource.handler
      );
    });

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
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
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", requireAuth(), handleSessionRequest);

// Handle DELETE requests for session termination
app.delete("/mcp", requireAuth(), handleSessionRequest);

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/mcp 🚀`);
});
