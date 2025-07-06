import * as dotenv from "dotenv";
dotenv.config();
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { google } from "googleapis";
import { z } from "zod";
import { tool } from "./types.js";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

const searchVideo: tool<{
  q: z.ZodOptional<z.ZodString>;
}> = {
  name: "searchVideo",
  description: "Search for a video on YouTube",
  schema: {
    q: z.string().optional().describe("The search query for the video"),
  },
  handler: async ({ q }, extra: RequestHandlerExtra<any, any>) => {
    const res = await youtube.search.list(
      {
        part: ["snippet"],
        q: q,
        type: ["video"],
        maxResults: 5,
        order: "relevance",
      },
      {}
    );

    console.table(
      res.data.items?.map((item) => ({
        Title: item.snippet?.title,
        Description: item.snippet?.description,
        Thumbnail: item.snippet?.thumbnails?.default?.url,
        Channel: item.snippet?.channelTitle,
        PublishedAt: item.snippet?.publishedAt,
      }))
    );

    // let formattedResults = "";
    // res.data.items?.forEach((item) => {
    //     formattedResults += `\n\n**Title:** ${item.snippet?.title}\n\n`;
    //     formattedResults += `**Description:** ${item.snippet?.description}\n\n`;
    //     formattedResults += `**Thumbnail:** ![Thumbnail](${item.snippet?.thumbnails?.default?.url})\n\n`;
    //     formattedResults += `**Channel:** ${item.snippet?.channelTitle}\n\n`;
    //     formattedResults += `**Published At:** ${item.snippet?.publishedAt}\n\n`;
    //     formattedResults += `**Link:** [Watch Video](https://www.youtube.com/watch?v=${item.id?.videoId})\n\n`;
    // });
    const result = await extra.sendRequest(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Please format the following search results for a YouTube video search query "${q}" in Markdown format:\n\n${JSON.stringify(
                  res.data.items,
                  null,
                  2
                )}`,
              },
            },
          ],
          maxTokens: 500,
          modelPreferences: {
            costPriority: 0.5, // Balance cost and performance
            intelligencePriority: 0.5, // Balance intelligence and performance
            speedPriority: 1, // Prioritize speed
          },
        },
      },
      CreateMessageResultSchema
    );

    const completion = result.content.text;    
    // console.log("🧠 Model used: ", result.model);
    console.log("🧠 Model used: ", result.model);
    console.log("Formatted Results:", completion);

    return {
      content: [
        {
          type: "text",
          text: typeof completion === "string" ? completion : String(completion), // Ensure text is a string
          //   text:
          //     formattedResults.length > 0
          //       ? `# Search results for "${q}"\n\n${formattedResults}`
          //       : `No results found for "${q}"`,
        },
      ],
    };
  },
};

export const searchTools = [
  searchVideo, // Search for a video on YouTube
];
