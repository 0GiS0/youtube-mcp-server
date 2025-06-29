import { z } from "zod";

/*
 * This file defines search prompts for the MCP remote server.
 * It includes a prompt to search for YouTube videos based on the codebase.
 * The prompt can be configured with a language argument.
 */
export const searchPrompts = [
  {
    name: "search_based_on_codebase",
    config: {
      title: "Search YouTube videos based on codebase",
      description:
        "Search for YouTube videos that are relevant to the codebase.",
      argsSchema: { language: z.string() },
    },
    handler: (args: { [x: string]: any; language?: unknown }) => {
      const language = typeof args.language === "string" ? args.language : "en";
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Search for YouTube videos that are relevant to the codebase in ${language} language.`,
            },
          },
        ],
      };
    },
  },
];
