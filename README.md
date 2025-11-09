# Implementación de Elicitations en Model Context Protocol (MCP)

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! Este proyecto demuestra cómo implementar **Elicitations** en un servidor MCP, una característica avanzada que permite a los servidores solicitar información adicional del usuario de forma interactiva durante la ejecución de herramientas, transformando aplicaciones estáticas en experiencias dinámicas y personalizables.

<a href="https://youtu.be/EDHa6oq-J8Q">
 <img src="https://img.youtube.com/vi/EDHa6oq-J8Q/maxresdefault.jpg" alt="Implementación de Elicitations en MCP" width="100%" />
</a>

## 📑 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sígueme](#-sígueme-en-mis-redes-sociales)

## ✨ Características

- **Elicitations interactivas**: Implementación completa del protocolo de elicitations de MCP que permite pausar la ejecución para solicitar información al usuario
- **Formularios estructurados con validación**: Uso de esquemas JSON Schema para validar y estructurar las entradas del usuario
- **Integración con YouTube API**: Búsqueda de videos personalizada según las preferencias del usuario (idioma, cantidad, tipo de contenido)
- **Valores por defecto inteligentes**: Configuraciones predeterminadas que aseguran una experiencia fluida
- **Mejora de consultas con IA**: Utiliza sampling para optimizar automáticamente las búsquedas
- **TypeScript con tipado estricto**: Código robusto y mantenible con tipos bien definidos
- **Servidor MCP remoto**: Implementación de servidor MCP que puede ejecutarse de forma independiente
- **Experiencia de usuario mejorada**: Interfaces más intuitivas y adaptables a las necesidades del usuario

## 🛠️ Tecnologías Utilizadas

- **TypeScript** - Lenguaje principal del proyecto con tipado estricto
- **Node.js** (ES2022) - Runtime de JavaScript
- **Model Context Protocol SDK** (v1.15.0) - SDK oficial de MCP para implementar servidores
- **Google APIs** (googleapis v150.0.1) - Cliente para integración con YouTube Data API v3
- **Zod** (v3.24.2) - Validación de esquemas y tipos en tiempo de ejecución
- **Express** (v5.1.0) - Framework web para el servidor
- **Chalk** (v5.4.1) - Estilización de logs en consola
- **dotenv** (v17.0.1) - Gestión de variables de entorno

## 📋 Requisitos Previos

- **Node.js** v18.0.0 o superior
- **npm** v9.0.0 o superior
- **Visual Studio Code** con la extensión GitHub Copilot Chat instalada
- **API Key de YouTube** - Puedes obtenerla desde [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Conocimientos básicos** de TypeScript y Model Context Protocol

## 🚀 Instalación

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/0GiS0/youtube-mcp-server.git
cd youtube-mcp-server
git checkout elicitations
```

### Paso 2: Navegar a la carpeta del proyecto
```bash
cd mcp-remote
```

### Paso 3: Instalar dependencias
```bash
npm install
```

### Paso 4: Configurar variables de entorno
```bash
cp .env-sample .env
```

Edita el archivo `.env` y añade tu API key de YouTube:
```bash
YOUTUBE_API_KEY=tu_api_key_aqui
```

> **Nota importante**: Puedes crear tu API key desde [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Asegúrate de habilitar la YouTube Data API v3 en tu proyecto.

### Paso 5: Compilar el proyecto
```bash
npm run build
```

### Paso 6: Ejecutar el servidor
```bash
npm start
```

### Paso 7: Configurar MCP en GitHub Copilot
Añade la configuración del servidor a tu archivo `mcp.json` (ubicado en `~/.config/Code/User/globalStorage/github.copilot-chat/`) para conectar con el servidor MCP.

## 💻 Uso

### Búsqueda de Videos con Elicitations

Una vez configurado el servidor, puedes usar GitHub Copilot Chat para buscar videos en YouTube. El sistema te solicitará preferencias mediante un formulario interactivo:

1. **Idioma preferido**: Selecciona entre español, inglés, chino, francés o alemán
2. **Número de videos**: Especifica cuántos resultados deseas (1-10)
3. **Tipo de contenido**: Elige entre contenido original o traducido

### Ejemplo de uso en GitHub Copilot Chat

```
Busca videos sobre "Inteligencia Artificial" en YouTube
```

El servidor pausará la ejecución y te mostrará un formulario para configurar tus preferencias. Una vez completado, realizará la búsqueda personalizada según tus selecciones.

### Características de las Elicitations implementadas

- **Personalización dinámica**: Adapta el comportamiento de las herramientas según las preferencias del usuario
- **Configuración interactiva**: Solicita parámetros opcionales o configuraciones específicas
- **Validación de entrada**: Confirma acciones críticas o solicita información faltante
- **Experiencia fluida**: Proporciona valores por defecto si el usuario no especifica preferencias

## 📁 Estructura del Proyecto

```
youtube-mcp-server/
├── mcp-remote/
│   ├── src/
│   │   ├── tools/
│   │   │   ├── searchTools.ts    # Implementación de elicitations
│   │   │   └── types.ts          # Definiciones de tipos
│   │   ├── prompts/              # Prompts del servidor
│   │   ├── resources/            # Recursos del servidor
│   │   └── index.ts              # Punto de entrada del servidor
│   ├── .env-sample               # Ejemplo de variables de entorno
│   ├── package.json              # Dependencias y scripts
│   ├── tsconfig.json             # Configuración de TypeScript
│   └── Dockerfile                # Contenedor Docker (opcional)
├── images/
│   └── MCP Elicitations.png      # Imagen de portada del video
└── README.md                     # Este archivo
```

### Archivos clave

- **`searchTools.ts`**: Contiene la implementación completa de elicitations con la herramienta de búsqueda de YouTube
- **`types.ts`**: Define los tipos TypeScript utilizados en el proyecto
- **`index.ts`**: Inicializa y configura el servidor MCP remoto

## 📚 Recursos Adicionales

- [Documentación oficial de Model Context Protocol](https://modelcontextprotocol.io)
- [Especificación de Elicitations en MCP](https://spec.modelcontextprotocol.io/specification/basic/elicitation/)
- [GitHub Copilot Chat Documentation](https://docs.github.com/en/copilot/github-copilot-chat)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Zod Documentation](https://zod.dev/)

## 🌐 Sígueme en Mis Redes Sociales

Si te ha gustado este proyecto y quieres ver más contenido como este, no olvides suscribirte a mi canal de YouTube y seguirme en mis redes sociales:

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>
