import * as dotenv from "dotenv";
dotenv.config();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { google } from "googleapis";

// Create a server instance
const server = new McpServer({
    name: "mcp-stdio-server",
    version: "1.0.0"
});

  
    
// Load the Google APIs client library
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});



// Tools
// https://modelcontextprotocol.io/docs/concepts/tools#tool-definition-structure

server.tool(
    // Name of the tool (used to call it)
    "get-youtube-channel",
    // Description of the tool (what it does)
    "Get YouTube Channel",
    // Schema for the tool (input validation)
    {
        query: z.string().min(1).max(100),
    },
    // Handler for the tool (function to be executed when the tool is called)
    async ({ query }) => {

        // If the user pass the complete URL, extract the channel handle
        if (query.startsWith("https://www.youtube.com/")) {
            const url = new URL(query);
            if (url.pathname.startsWith("/channel/")) {
                query = url.pathname.split("/channel/")[1];
            } else if (url.pathname.startsWith("/c/")) {
                query = url.pathname.split("/c/")[1];
            } else if (url.pathname.startsWith("/user/")) {
                query = url.pathname.split("/user/")[1];
            } else if (url.pathname.startsWith("/@")) {
                // Handle URLs like https://www.youtube.com/@returngis
                // Remove the leading slash and the '@' symbol
                query = url.pathname.replace("/", "").replace(/^@/, "");
            } else if (url.searchParams.has("channelId")) {
                query = url.searchParams.get("channelId") || "";
            } else {
                throw new Error("Invalid YouTube channel URL");
            }
        }

        // Call the youtube API for seach channels
        const res = await youtube.channels.list({
            part: ['snippet'],
            forHandle: query,
            maxResults: 5,

        }, {});


        // Log the results to the console
        console.table(
            res.data.items?.map((item) => ({
                Title: item.snippet?.title,
                Description: item.snippet?.description,
                Thumbnail: item.snippet?.thumbnails?.default?.url,
                Language: item.snippet?.defaultLanguage,
                Country: item.snippet?.country,
                PublishedAt: item.snippet?.publishedAt,
            })));

        // Return the results to the client
        let formattedResults = "";
        res.data.items?.forEach((item) => {
            formattedResults += `\n\n**Title:** ${item.snippet?.title}\n\n`;
            formattedResults += `**Description:** ${item.snippet?.description}\n\n`;
            formattedResults += `**Thumbnail:** ![Thumbnail](${item.snippet?.thumbnails?.default?.url})\n\n`;
            formattedResults += `**Published At:** ${item.snippet?.publishedAt}\n\n`;
            formattedResults += `**URL:** http://youtube.com/${item.snippet?.customUrl}\n\n`;
        });

        return {
            content: [
                {
                    type: "text",
                    text: formattedResults.length > 0
                        ? `# Search results for "${query}"\n\n${formattedResults}`
                        : `No results found for "${query}"`,
                },
            ],
        };
    },);

async function main() {

    // Start the server with Stdio transport
    const transport = new StdioServerTransport();
    // Connect the server to the transport
    await server.connect(transport);

    console.error("This MCP Server is running on stdio 🖥️");
}

main().catch((error) => {

    console.error("👎🏻 Fatal error in main():", error);
    process.exit(1);

});