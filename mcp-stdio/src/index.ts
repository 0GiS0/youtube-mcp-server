// 📦 Importar las dependencias necesarias
import * as dotenv from "dotenv";
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // 📝 Librería para validación de esquemas
import { google } from "googleapis"; // 🎥 Cliente oficial de APIs de Google

// 🚀 Crear una instancia del servidor MCP (Model Context Protocol)
const server = new McpServer({
  name: "mcp-stdio-server",
  version: "1.0.0",
});

// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // 🔑 API Key obtenida de las variables de entorno
});

function formatSubscriberCount(count?: string | null): string {
  if (!count) {
    return "N/A";
  }

  const parsedCount = Number(count);
  return Number.isFinite(parsedCount)
    ? parsedCount.toLocaleString("en-US")
    : count;
}

// 🛠️ Definir las herramientas (Tools) del servidor
// 📚 Documentación: https://modelcontextprotocol.io/docs/concepts/tools#tool-definition-structure

server.registerTool(
  // 📌 Nombre de la herramienta (se usa para invocarla desde el cliente)
  "get_youtube_channel",
  // 📋 Esquema de la herramienta (define cómo se valida la entrada)
  {
    title: "Get YouTube Channel",
    description: "Search for a YouTube channel by its name.",
    inputSchema: {
      query: z
        .string()
        .describe("The name of the YouTube channel to search for"),
    },
  },
  // ⚡ Handler: función que se ejecuta cuando se llama a la herramienta
  async ({ query }) => {
    console.log("Calling get_youtube_channel with query:", query);

    // 🔍 Llamar a la API de YouTube para buscar canales por handle
    const res = await youtube.channels.list(
      {
        part: ["snippet", "statistics"], // 📄 Solicitar datos básicos y estadísticas
        forHandle: query, // 🎯 Buscar por el handle del canal
        maxResults: 5, // 🔢 Limitar a 5 resultados máximo
      },
      {},
    );

    // 📊 Mostrar los resultados en la consola en formato de tabla
    console.table(
      res.data.items?.map((item) => ({
        Title: item.snippet?.title,
        Description: item.snippet?.description,
        Subscribers: item.statistics?.hiddenSubscriberCount
          ? "Hidden"
          : formatSubscriberCount(item.statistics?.subscriberCount),
        Thumbnail: item.snippet?.thumbnails?.default?.url,
        Language: item.snippet?.defaultLanguage,
        Country: item.snippet?.country,
        PublishedAt: item.snippet?.publishedAt,
      })),
    );

    // 📝 Formatear los resultados para devolverlos al cliente en Markdown
    let formattedResults = "";
    res.data.items?.forEach((item) => {
      const subscriberCount = item.statistics?.hiddenSubscriberCount
        ? "Hidden"
        : formatSubscriberCount(item.statistics?.subscriberCount);

      formattedResults += `\n\n**Title:** ${item.snippet?.title}\n\n`;
      formattedResults += `**Description:** ${item.snippet?.description}\n\n`;
      formattedResults += `**Subscribers:** ${subscriberCount}\n\n`;
      formattedResults += `**Thumbnail:** ![Thumbnail](${item.snippet?.thumbnails?.default?.url})\n\n`;
      formattedResults += `**Published At:** ${item.snippet?.publishedAt}\n\n`;
      formattedResults += `**URL:** http://youtube.com/${item.snippet?.customUrl}\n\n`;
    });

    // ✅ Devolver la respuesta formateada al cliente
    return {
      content: [
        {
          type: "text",
          text:
            formattedResults.length > 0
              ? `# Search results for "${query}"\n\n${formattedResults}`
              : `No results found for "${query}"`, // ❌ Mensaje si no hay resultados
        },
      ],
    };
  },
);

// 🎯 Función principal para iniciar el servidor
async function main() {
  // 🔌 Iniciar el servidor con transporte Stdio (entrada/salida estándar)
  const transport = new StdioServerTransport();
  // 🤝 Conectar el servidor al transporte
  await server.connect(transport);

  console.error("This MCP Server is running on stdio 🖥️");
}

// 🏁 Ejecutar la función principal y manejar errores
main().catch((error) => {
  console.error("👎🏻 Fatal error in main():", error);
  process.exit(1); // 🛑 Salir del proceso con código de error
});
