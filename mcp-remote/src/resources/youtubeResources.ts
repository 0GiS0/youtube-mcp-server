// Static resource for my YouTube channel
export const youtubeResources = [
  {
    name: "My Youtube Channel",
    uri: "https://www.youtube.com/@returngis",
    config: {
      title: "My Youtube Channel",
      description: "My personal Youtube channel",
      mimeType: "text/plain",
    },
    handler: async (uri: any) => ({
      contents: [
        {
          uri: uri.href,
          text: `My Youtube Channel ${uri.href}`,
        },
      ],
    }),
  },
];

