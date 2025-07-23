# Implementación de Elicitations en Model Context Protocol (MCP)

<!-- Placeholder para imagen con enlace a vídeo de YouTube -->
[![Video Tutorial](images/MCP%20Elicitations.png)](https://youtu.be/EDHa6oq-J8Q)
*Haz clic en la imagen para ver el video tutorial*

¡Hola developer 👋🏻! Este branch demuestra cómo implementar **Elicitations** en un servidor MCP, una característica avanzada que permite a los servidores MCP solicitar información adicional del usuario de forma interactiva durante la ejecución de herramientas.

## ✨ ¿Qué son las Elicitations?

Las Elicitations son una característica poderosa de MCP que permite que un servidor pause la ejecución de una herramienta para solicitar información adicional del usuario mediante un formulario estructurado. Esto transforma las herramientas estáticas en experiencias interactivas y personalizables.

### Casos de uso principales:

- **Personalización dinámica**: Adaptar el comportamiento de las herramientas según las preferencias del usuario
- **Configuración interactiva**: Solicitar parámetros opcionales o configuraciones específicas
- **Validación de entrada**: Confirmar acciones críticas o solicitar información faltante
- **Experiencia de usuario mejorada**: Crear interfaces más intuitivas y flexibles

## 🎯 Ejemplo práctico: Búsqueda de YouTube

En este repositorio encontrarás un ejemplo completo de implementación en `mcp-remote/src/tools/searchTools.ts`. La herramienta de búsqueda de YouTube utiliza elicitations para:

1. **Solicitar el idioma preferido** para los videos (español, inglés, chino, francés, alemán)
2. **Permitir al usuario especificar** cuántos videos desea ver (1-10)
3. **Preguntar si prefiere** contenido original o traducido

### Características del ejemplo:

- **Formulario con validación**: Usa esquemas JSON para validar la entrada del usuario
- **Valores por defecto**: Proporciona configuraciones predeterminadas si el usuario no especifica preferencias
- **Integración con APIs externas**: Combina las preferencias del usuario con la API de YouTube
- **Mejora de consultas con IA**: Utiliza sampling para mejorar automáticamente las consultas de búsqueda

## 🔧 Estructura del código

```
mcp-remote/
└── src/
    └── tools/
        ├── searchTools.ts    # Implementación de elicitations
        └── types.ts         # Definiciones de tipos
```

## 🚀 Cómo probar el ejemplo

### Prerrequisitos
1. Tener Visual Studio Code con GitHub Copilot Chat instalado
2. Configurar una API key de YouTube en el archivo `.env` como `YOUTUBE_API_KEY=tu_api_key`

### Pasos para ejecutar:
1. Clona este repositorio
2. Navega a la carpeta `mcp-remote`
3. Instala las dependencias: `npm install`
4. Compila el proyecto: `npm run build`
5. Ejecuta el servidor: `npm start`
6. Configura tu `mcp.json` para conectar con el servidor
7. Usa el comando de búsqueda en GitHub Copilot Chat y experimenta con las elicitations

## 📚 Recursos adicionales

- [Documentación oficial de MCP](https://modelcontextprotocol.io)
- [Especificación de Elicitations](https://spec.modelcontextprotocol.io/specification/basic/elicitation/)
- [GitHub Copilot Chat Documentation](https://docs.github.com/en/copilot/github-copilot-chat)
