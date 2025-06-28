
export const searchPrompts = [
  {
    name: "search_based_on_codebase",
    config: {
      title: "Search YouTube videos based on codebase",
      description: "Search for YouTube videos that are relevant to the codebase.",
      argsSchema: { language: z.string() },
    },
    handler: ({ language }: { language: string }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Search for YouTube videos that are relevant to the codebase in ${language} language.`,
          },
        },
      ],
    }),
  },
];
