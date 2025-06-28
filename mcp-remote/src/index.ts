import express, { RequestHandler } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { searchTools } from "./tools/searchTools.js";
import { searchPrompts } from "./prompts/searchPrompts.js";
import { z } from "zod";

import * as dotenv from "dotenv";
import { metadataHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/metadata.js";
import {
  InvalidTokenError,
  ServerError,
} from "@modelcontextprotocol/sdk/server/auth/errors.js";
dotenv.config();

const PORT = process.env.PORT || 3001;
const ISSUER = process.env.ISSUER;

// Create a new SSEServerTransport instance
let transport: SSEServerTransport;

// Create a new McpServer instance
const server = new McpServer({
  name: "remote-mcp-server",
  version: "2.0.0",
});

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

// Register the tools
[...searchTools].forEach((tool) => {
  server.tool(tool.name, tool.description, tool.schema, tool.handler);
});

// Register prompts
searchPrompts.forEach((prompt) => {
  server.registerPrompt(prompt.name, prompt.config, prompt.handler);
});

// Register resources

// Create an Express application
const app = express();

// Endpoint with metadata for OAuth
app.use(mcpMetadataRouter());

// Middleware to parse JSON request bodies
app.get("/sse", requireAuth(), async (req, res) => {
  console.log("Received SSE connection 🔗");

  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});

// Middleware to handle POST requests
app.post("/message", requireAuth(), async (req, res) => {
  console.log(`Received POST message 💌`);

  await transport.handlePostMessage(req, res);
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
