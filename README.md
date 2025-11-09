# YouTube MCP Server

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! En este repositorio encontrarás ejemplos prácticos de cómo crear servidores MCP (Model Context Protocol) y usarlos con GitHub Copilot Chat. Aprenderás a implementar tanto el transporte stdio como el transporte remoto (SSE) para integrar servicios externos con modelos de lenguaje.

<a href="https://youtu.be/khz4nWR9l20">
 <img src="https://img.youtube.com/vi/khz4nWR9l20/maxresdefault.jpg" alt="Cómo crear MCP Servers y usarlos con GitHub Copilot Chat 🚀💻🤖" width="100%" />
</a>

## 📑 Tabla de Contenidos
- [¿Qué es Model Context Protocol?](#qué-es-model-context-protocol)
- [Componentes del MCP](#componentes-del-mcp)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [MCP Inspector](#mcp-inspector)
- [Contribuir](#contribuir)
- [Sígueme](#sígueme-en-mis-redes-sociales)

## ¿Qué es Model Context Protocol?

Model Context Protocol (MCP) es un protocolo que permite a los modelos de lenguaje interactuar con otros sistemas y servicios a través de un conjunto de APIs estandarizadas. Esto permite a los modelos de lenguaje acceder a información externa y realizar acciones en otros sistemas, lo que amplía su funcionalidad y utilidad. En la documentación oficial se compara con un USB-C, que permite conectar diferentes dispositivos y sistemas.

## Componentes del MCP

- **MCP Server**: Es el servidor que implementa el protocolo y permite a los modelos de lenguaje interactuar con otros sistemas y servicios. El MCP Server actúa como intermediario entre el modelo de lenguaje y los sistemas externos.
- **MCP Client**: Es el cliente que se conecta al MCP Server y envía solicitudes para interactuar con otros sistemas y servicios. El MCP Client puede ser un modelo de lenguaje o cualquier otro sistema que necesite interactuar con el MCP Server. Este puede ser la aplicación de escritorio de Claude o un IDE como Visual Studio Code y GitHub Copilot Chat 😃.

## ✨ Características

- 🎥 **Integración con YouTube API**: Buscar canales de YouTube y obtener información detallada
- 🔄 **Dos implementaciones de transporte**: stdio para uso local y SSE para uso remoto
- 🛠️ **Servidor MCP completo**: Implementación funcional del protocolo Model Context Protocol
- 🎯 **Ejemplos prácticos**: Código listo para usar y adaptar a tus necesidades
- 🤖 **Compatible con GitHub Copilot Chat**: Integración directa con tu IDE favorito
- 📝 **Código TypeScript**: Tipado estático para mayor seguridad y mejor experiencia de desarrollo

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **@modelcontextprotocol/sdk** - SDK oficial del protocolo MCP
- **Google APIs** - Cliente oficial de YouTube API v3
- **Express** - Framework web para el servidor remoto (mcp-remote)
- **dotenv** - Gestión de variables de entorno
- **Zod** - Validación de esquemas

## 📋 Requisitos Previos

- **Node.js** v18.0.0 o superior
- **npm** o **yarn** instalado
- **YouTube API Key** - Puedes obtener una desde [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **GitHub Copilot Chat** (opcional) - Para probar la integración con VS Code

## 🚀 Instalación

### Opción 1: MCP Server con transporte stdio (mcp-stdio)

Este servidor implementa el transporte stdio y permite interactuar con el modelo de lenguaje a través de la entrada y salida estándar.

#### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/0GiS0/youtube-mcp-server.git
cd youtube-mcp-server/mcp-stdio
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

#### Paso 3: Configurar variables de entorno
```bash
cp .env-sample .env
```

Edita el archivo `.env` y añade tu API Key de YouTube:
```env
YOUTUBE_API_KEY=tu_api_key_aqui
```

#### Paso 4: Compilar el proyecto
```bash
npm run build
```

### Opción 2: MCP Server remoto con SSE (mcp-remote)

Este servidor implementa el transporte SSE (Server-Sent Events) y permite interactuar con el modelo de lenguaje a través de eventos del servidor.

#### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/0GiS0/youtube-mcp-server.git
cd youtube-mcp-server/mcp-remote
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

#### Paso 3: Configurar variables de entorno
```bash
cp .env-sample .env
```

Edita el archivo `.env` y añade tu API Key de YouTube:
```env
YOUTUBE_API_KEY=tu_api_key_aqui
```

#### Paso 4: Compilar y ejecutar el proyecto
```bash
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 💻 Uso

### Configurar con GitHub Copilot Chat

Para usar estos servidores MCP con GitHub Copilot Chat, necesitas configurarlos en tu archivo de configuración de MCP.

#### Para mcp-stdio:

1. Abre la configuración de GitHub Copilot Chat
2. Agrega la configuración del servidor MCP stdio en tu archivo de configuración

#### Para mcp-remote:

1. Asegúrate de que el servidor esté corriendo (`npm start`)
2. Configura GitHub Copilot Chat para conectarse al endpoint del servidor
3. El servidor expone las herramientas MCP a través de HTTP

### Ejemplo de herramientas disponibles

El servidor MCP incluye la herramienta `get_youtube_channel` que permite:

- Buscar canales de YouTube por nombre
- Obtener información detallada del canal
- Acceder a estadísticas y metadatos

**Ejemplo de uso en el chat:**
```
"Busca el canal de YouTube @0GiS0"
```

El MCP Server procesará la solicitud y devolverá información del canal usando la YouTube API.

## 📁 Estructura del Proyecto

```
youtube-mcp-server/
├── mcp-stdio/              # Servidor MCP con transporte stdio
│   ├── src/
│   │   └── index.ts        # Implementación del servidor stdio
│   ├── .env-sample         # Ejemplo de variables de entorno
│   ├── package.json        # Dependencias del proyecto
│   └── tsconfig.json       # Configuración de TypeScript
├── mcp-remote/             # Servidor MCP con transporte SSE
│   ├── src/
│   │   └── index.js        # Implementación del servidor remoto
│   ├── .env-sample         # Ejemplo de variables de entorno
│   ├── Dockerfile          # Configuración para Docker
│   ├── package.json        # Dependencias del proyecto
│   └── tsconfig.json       # Configuración de TypeScript
├── images/                 # Recursos gráficos
└── README.md              # Este archivo
```

## 🔍 MCP Inspector

Para probar un servidor MCP puedes hacerlo usando directamente el Chat de GitHub Copilot, pero hay veces que es más sencillo usar MCP Inspector. Esta herramienta te permite inspeccionar y probar las herramientas del servidor de forma interactiva.

Para lanzarlo, usa este comando:

```bash
npx @modelcontextprotocol/inspector
```

> **Nota:** El Inspector MCP te permite probar las herramientas del servidor, ver los esquemas de entrada/salida y depurar el comportamiento del servidor antes de integrarlo con tu cliente MCP.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🌐 Sígueme en Mis Redes Sociales

Si te ha gustado este proyecto y quieres ver más contenido como este, no olvides suscribirte a mi canal de YouTube y seguirme en mis redes sociales:

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>
