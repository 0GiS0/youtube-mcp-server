// 📦 Importar las dependencias necesarias
import express from "express"; // 🌐 Framework web para crear el servidor HTTP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // 🚀 Servidor MCP
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"; // 📡 Transporte SSE (Server-Sent Events)
import { searchTools } from "./tools/searchTools.js"; // 🔍 Herramientas de búsqueda personalizadas

// ⚙️ Configurar el puerto del servidor (usa variable de entorno o 3001 por defecto)
const PORT = process.env.PORT || 3001;

// 📡 Crear una instancia del transporte SSE (se inicializará cuando llegue una conexión)
let transport: SSEServerTransport;


// 🚀 Crear una nueva instancia del servidor MCP
const server = new McpServer({
    name: "remote-mcp-server",
    version: "1.0.0"
});


// 🛠️ Registrar todas las herramientas (tools) en el servidor
// Itera sobre cada herramienta y la registra con su nombre, descripción, esquema y handler
[...searchTools].forEach((tool) => {
    server.tool(tool.name, tool.description, tool.schema, tool.handler);
});

// 🌐 Crear una aplicación Express
const app = express();

// 📡 Endpoint GET /sse: Establece la conexión SSE (Server-Sent Events)
// Este endpoint permite la comunicación en tiempo real del servidor al cliente
app.get("/sse", async (req, res) => {

    console.log("Received SSE connection 🔗");

    // 🔌 Crear el transporte SSE y conectar el servidor MCP
    transport = new SSEServerTransport("/message", res);
    await server.connect(transport);

});

// 📬 Endpoint POST /message: Recibe mensajes del cliente
// Este endpoint maneja las peticiones POST que envía el cliente
app.post("/message", async (req, res) => {

    console.log(`Received POST message 💌`);

    // 📨 Procesar el mensaje recibido a través del transporte
    await transport.handlePostMessage(req, res);
});


// 🎧 Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT} 🚀`);

});