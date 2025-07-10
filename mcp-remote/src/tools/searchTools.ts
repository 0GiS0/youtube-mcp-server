import * as dotenv from "dotenv";
dotenv.config();
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { google } from "googleapis";
import { z } from "zod";
import { tool } from "./types.js";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import chalk from "chalk";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

const searchVideo: tool<{
  q: z.ZodString;
}> = {
  name: "searchVideo",
  description: "Search for a video on YouTube",
  schema: {
    q: z.string().describe("The search query for the video"),
  },
  handler: async (args, extra: RequestHandlerExtra<any, any>) => {
    // Asegura que siempre haya un valor para q
    const q = typeof args.q === 'string' ? args.q : '';
    console.log(chalk.blue("🔍 [SEARCH]"), chalk.white(`Searching YouTube for: "${q}"`));

    // Default preferences for the search
    let language = "english"; // Default language
    let languageLocal = "inglés"; // Default local name
    let number_of_videos = 5; // Default number of videos
    let translated_or_original = "original"; // Default content type

    // Solicitar preferencias del usuario
    const response = await extra.sendRequest(
      {
        method: "elicitation/create",
        params: {
          message: "Por favor, configura tus preferencias para la búsqueda de videos:",
          requestedSchema: {
            type: "object",
            properties: {
              language: {
                type: "string",
                title: "Idioma preferido",
                description: "El idioma en el que prefieres que estén los videos",
                enum: ["spanish", "english", "chinese", "french", "german"],
                enumNames: ["spanish", "english", "chinese", "french", "german"]
              },
              number_of_videos: {
                type: "number",
                title: "Cantidad de videos",
                description: "Número de videos que deseas obtener en los resultados",
                minimum: 1,
                maximum: 10,
                default: 5
              },
              translated_or_original: {
                type: "string",
                title: "Tipo de contenido",
                description: "¿Prefieres contenido original o traducido?",
                enum: ["translated", "original"],
                enumNames: ["Traducido", "Original"],
                default: "original"
              }
            },
            required: ["language"]
          },
        }
      },
      z.any()
    );

    console.log(chalk.green("📝 [USER INPUT]"), chalk.white("User preferences received"));
    if (response) {
      // Actualiza los valores por defecto con los valores proporcionados por el usuario

      console.log(chalk.cyan("🤖 [AI]"), chalk.white("Using user preferences for search"));
      console.log(chalk.gray("🔍 [PREFERENCES]"), chalk.white(JSON.stringify(response, null, 2)));

      language = response.content.language || language;
      number_of_videos = response.content.number_of_videos || number_of_videos;
      translated_or_original = response.content.translated_or_original || translated_or_original;
    } else {
      console.log(chalk.yellow("⚠️ [DEFAULT]"), chalk.white("Using default preferences for search"));
    }

    // Mapear idioma a código ISO y nombre local para la API de YouTube y el prompt
    const languageMap: Record<string, { code: string; local: string }> = {
      spanish: { code: "es", local: "español" },
      english: { code: "en", local: "inglés" },
      chinese: { code: "zh", local: "chino" },
      french: { code: "fr", local: "francés" },
      german: { code: "de", local: "alemán" }
    };
    const youtubeLanguage = languageMap[language]?.code || "en";
    languageLocal = languageMap[language]?.local || language;

    // Mejorar la consulta de búsqueda utilizando Sampling
    const prompt = `Mejora la siguiente consulta de búsqueda para YouTube: "${q}". Traduce y adapta la consulta al idioma preferido por el usuario: "${languageLocal}" 
    (por ejemplo, si es español, responde en español). No incluyas explicaciones ni formato adicional, responde solo con el texto de la consulta mejorada en el idioma solicitado.`;

    console.log(chalk.cyan("🤖 [AI]"), chalk.white("Requesting AI to enhance the search query"));
    console.log(chalk.gray("🔍 [QUERY]"), chalk.white(prompt));

    const enhancedQuery = await extra.sendRequest(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: prompt,
              },
            },
          ],
          maxTokens: 100,
          modelPreferences: {
            costPriority: 0.5, // Balance cost and performance
            intelligencePriority: 0.5, // Balance intelligence and performance
            speedPriority: 1, // Prioritize speed
          },
        },
      },
      CreateMessageResultSchema
    );

    const enhancedQueryText = enhancedQuery.content.text;
    console.log(chalk.cyan("🤖 [AI]"), chalk.white("Enhanced query received from AI"));
    console.log(chalk.gray("🔍 [ENHANCED QUERY]"), chalk.white(enhancedQueryText));

    // Use the user's preferences in the search
    const res = await youtube.search.list({
      part: ["snippet"],
      q: enhancedQueryText as string, // Use the enhanced query
      type: ["video"],
      maxResults: number_of_videos,
      order: "relevance",
      videoCaption: translated_or_original === "translated" ? "closedCaption" : "any",
      relevanceLanguage: youtubeLanguage,
    });


    console.log(chalk.green("📊 [RESULTS]"), chalk.white(`Found ${res.data.items?.length || 0} videos`));

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
    console.log(chalk.cyan("🤖 [AI]"), chalk.white("Requesting AI formatting of results"));

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
    console.log(chalk.magenta("🧠 [AI MODEL]"), chalk.yellow(result.model));
    console.log(chalk.green("📝 [FORMATTED]"), chalk.white("AI formatted results ready"));
    console.log(chalk.gray("📄 [PREVIEW]"), chalk.white(typeof completion === "string" ? completion.substring(0, 100) + "..." : "Content generated"));

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
