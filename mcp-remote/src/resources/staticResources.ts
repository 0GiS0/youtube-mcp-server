
// Static resource for my YouTube channel
const youtubeResources = {
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
};

const docForMCPTypescriptSDK = {
  name: "MCP Documentation for Typescript SDK",
  uri: "https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/refs/heads/main/README.md",
  config: {
    title: "MCP Typescript SDK Documentation",
    description: "Documentation for the Model Context Protocol Typescript SDK",
    mimeType: "text/markdown",
  },
  handler: async (uri: any) => ({

    // Download the content from the provided URI
    // and return it as a text/plain content type
    contents: [
      {
        uri: uri.href,
        text: `${await fetch(uri.href).then((res) => res.text())}`,
      },
    ],
  }),
};

export const resources = [youtubeResources, docForMCPTypescriptSDK];
