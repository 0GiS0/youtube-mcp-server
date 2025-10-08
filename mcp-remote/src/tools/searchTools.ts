// 📦 Importar las dependencias necesarias
import * as dotenv from "dotenv";
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
import { google } from "googleapis"; // 🎥 Cliente oficial de APIs de Google
import { z } from "zod"; // 📝 Librería para validación de esquemas
import { tool } from "./types.js"; // 🛠️ Tipo personalizado para definir herramientas

// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY, // 🔑 API Key obtenida de las variables de entorno
});


// 🔍 Herramienta para buscar videos en YouTube
const searchVideo: tool<{
    q: z.ZodOptional<z.ZodString>;
}> = {
    // 📌 Nombre de la herramienta
    name: "search_video",
    // 📄 Descripción de la funcionalidad
    description: "Search for a video on YouTube",
    // 📋 Esquema de validación de los parámetros de entrada
    schema: {
        q: z
            .string()
            .optional() // ❓ Parámetro opcional
            .describe("The search query for the video"), // 💬 Descripción del parámetro
    },
    // ⚡ Handler: función que ejecuta la búsqueda
    handler: async ({ q }) => {

        // 🎯 Llamar a la API de YouTube Search para buscar videos
        const res = await youtube.search.list({
            part: ['snippet'], // 📄 Solicitar solo la información básica (snippet)
            q: q, // 🔎 Query de búsqueda
            type: ['video'], // 🎥 Filtrar solo videos (no canales ni playlists)
            maxResults: 5, // 🔢 Limitar a 5 resultados
            order: 'relevance', // 📊 Ordenar por relevancia
        }, {});

        // 📊 Mostrar los resultados en la consola en formato de tabla
        console.table(
            res.data.items?.map((item) => ({
            Title: item.snippet?.title,
            Description: item.snippet?.description,
            Thumbnail: item.snippet?.thumbnails?.default?.url,
            Channel: item.snippet?.channelTitle,
            PublishedAt: item.snippet?.publishedAt,
            }))
        );

        // 📝 Formatear los resultados en Markdown para devolverlos al cliente
        let formattedResults = "";
        res.data.items?.forEach((item) => {
            formattedResults += `\n\n**Title:** ${item.snippet?.title}\n\n`;            
            formattedResults += `**Description:** ${item.snippet?.description}\n\n`;
            formattedResults += `**Thumbnail:** ![Thumbnail](${item.snippet?.thumbnails?.default?.url})\n\n`;
            formattedResults += `**Channel:** ${item.snippet?.channelTitle}\n\n`;
            formattedResults += `**Published At:** ${item.snippet?.publishedAt}\n\n`;
            formattedResults += `**Link:** [Watch Video](https://www.youtube.com/watch?v=${item.id?.videoId})\n\n`;
        });

        // ✅ Devolver la respuesta formateada
        return {
            content: [
                {
                    type: "text",
                    text: formattedResults.length > 0
                        ? `# Search results for "${q}"\n\n${formattedResults}` // ✨ Resultados encontrados
                        : `No results found for "${q}"`, // ❌ Sin resultados
                }
            ]
        };
    }
};

// 📚 Exportar el array con todas las herramientas de búsqueda disponibles
export const searchTools = [
    searchVideo // 🎥 Herramienta para buscar videos en YouTube
];