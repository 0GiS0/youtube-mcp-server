# Código de ejemplo actualizado para Model Context Protocol (MCP) y GitHub Copilot Chat

¡Hola developer 👋🏻! En este branch vas a encontrar muchas de las últimas novedades de la especificación Model Context Protocol (2025-06-18) y de lo soportado en Visual Studio Code para poder usar servidores MCP con GitHub Copilot Chat.

En el branch `main` he dejado el código original que usé para mi vídeo Cómo crear[ MCP Servers y usarlos con GitHub Copilot Chat 🚀💻🤖](https://youtu.be/khz4nWR9l20) para que puedas ver las diferencias de lo que se soportó inicialmente y lo que hemos mejorado hasta ahora.


# Diferencia #1: Cambio del transporte SSE (Server-Sent Events) a Streamable HTTP

En la especificación original de MCP se usaba el transporte SSE (Server-Sent Events) para enviar mensajes desde el servidor al cliente. Sin embargo, en la última versión de la especificación se ha cambiado a un transporte más eficiente basado en HTTP Streamable. Este cambio permite una comunicación más fluida y eficiente entre el servidor y el cliente.

## ¿Por qué Streamable HTTP es mejor que SSE?

- **Comunicación bidireccional real**: SSE solo permite que el servidor envíe mensajes al cliente, mientras que Streamable HTTP permite el intercambio de mensajes en ambos sentidos usando un único canal HTTP.
- **Gestión de sesiones y reconexión**: Streamable HTTP soporta la gestión de sesiones, lo que facilita la recuperación ante caídas de conexión y la escalabilidad horizontal (varios servidores pueden compartir el estado de las sesiones).
- **Compatibilidad con proxies y firewalls**: Al usar HTTP estándar, Streamable HTTP es más compatible con infraestructuras modernas, proxies y balanceadores de carga, evitando problemas típicos de SSE en entornos empresariales o cloud.
- **Notificaciones y mensajes más robustos**: Permite enviar tanto notificaciones del servidor al cliente como mensajes del cliente al servidor de forma eficiente y sin abrir múltiples conexiones.
- **Mejor manejo de errores y control de flujo**: Streamable HTTP facilita la gestión de errores, el control de flujo y la recuperación de estado, mejorando la experiencia de usuario y la robustez del protocolo.

En resumen, Streamable HTTP es la opción recomendada para nuevos desarrollos MCP, ya que ofrece mayor flexibilidad, robustez y compatibilidad con los entornos actuales.


# Diferencia #2: Autenticación

En versiones recientes de la especificación MCP se ha introducido soporte para autenticación basada en OAuth 2.1, lo que permite proteger el acceso a los recursos, herramientas y prompts de tu servidor MCP de forma estándar y segura.

## ¿Por qué OAuth 2.1?

- Es el estándar actual para autorización segura en APIs modernas.
- Permite a los usuarios autenticarse usando proveedores externos (Google, Microsoft, Auth0, etc.) o tu propio sistema.
- Facilita la gestión de permisos y el control de acceso granular a recursos y herramientas.
- Mejora la interoperabilidad con clientes y plataformas que ya soportan OAuth.

## Opciones de implementación en MCP

- **Proveedor propio:** Puedes implementar tu propio flujo OAuth 2.1 directamente en el servidor MCP.
- **Proxy a proveedor externo:** Usando el SDK, puedes delegar la autenticación a un proveedor externo (por ejemplo, Auth0, Azure AD, Google, etc.) mediante el `ProxyOAuthServerProvider`.
- **Validación personalizada:** Puedes añadir lógica personalizada para validar tokens, gestionar clientes y controlar el ciclo de vida de las sesiones.
- **Documentación y endpoints configurables:** El SDK permite exponer endpoints de autorización, revocación y documentación de servicio de forma flexible.

Esto permite que tu servidor MCP sea seguro y compatible con los estándares modernos de autenticación, facilitando la integración en entornos empresariales y aplicaciones de terceros.


## Opciones de registro de clientes OAuth

El soporte de autenticación en MCP permite dos formas principales de registrar aplicaciones cliente:

- **Dynamic Client Registration:** Puedes permitir que los clientes se registren dinámicamente en el proveedor OAuth, lo que facilita la integración automática de nuevas aplicaciones sin intervención manual.
- **Client ID pre-creado:** También puedes utilizar un client ID y secreto previamente creados en el proveedor OAuth (por ejemplo, en Auth0, Azure AD, Google, etc.), lo que es ideal para escenarios empresariales o cuando se requiere un control más estricto sobre las aplicaciones que pueden autenticarse.


Ambas opciones son compatibles y puedes elegir la que mejor se adapte a tu flujo de trabajo y requisitos de seguridad. Esto aporta flexibilidad para entornos de desarrollo, pruebas y producción, y facilita la integración tanto con aplicaciones propias como de terceros.

### ¿Cómo funciona si ya tienes un client ID registrado?

Si ya tienes una aplicación registrada previamente en tu proveedor OAuth (por ejemplo, Auth0, Azure AD, Google Cloud, etc.), simplemente puedes reutilizar el client ID y el secreto asociados a esa app. Solo tienes que configurar tu servidor MCP para que acepte ese client ID y, si es necesario, el secreto correspondiente.

De este modo, solo las aplicaciones que conozcan ese client ID podrán autenticarse contra tu servidor MCP, lo que te permite un control total sobre qué apps pueden acceder. Esta opción es ideal para entornos empresariales, producción o cuando necesitas restringir el acceso a un conjunto concreto de aplicaciones confiables.

En la mayoría de proveedores, puedes gestionar los client IDs y secretos desde el panel de administración, y configurar los scopes, redirecciones y permisos según tus necesidades.

En este branch solo se muestra un ejemplo con Dynamic Client Registration.

# Diferencia #3: Depurar servidores MCP

Ahora en Visual Studio Code puedes depurar servidores MCP de forma más sencilla. Puedes usar el depurador integrado para establecer puntos de interrupción, inspeccionar variables y seguir el flujo de ejecución de tu servidor MCP. En la configuracion de `mcp.json`puedes añadir algo como esto:

```json
  "servers": {
    "remote-mcp": {
      "type": "http",
      "url": "http://localhost:3001/mcp",
      "dev": {
        "watch": "mcp-remote/dist/src/**/*.js",
        "debug": { "type": "node" }
      }
    },
...
```

# Diferencia #4: Soporte de prompts como parte GitHub Copilot Chat

Ahora los MCP servers pueden traer consigo prompts que se pueden usar directamente en el chat de GitHub Copilot. Esto permite que los usuarios puedan interactuar con el modelo de lenguaje de forma más natural y fluida, utilizando prompts predefinidos que pueden ser personalizados según las necesidades del usuario. Estos soportan incluso placeholders que se pueden rellenar con información específica del contexto. Tienes un ejemplo en el archivo `mcp-remote/src/prompts/searchPrompts.ts`.

# Diferencia #5: Recursos estáticos

Los MCP servers ahora pueden registrar recursos estáticos que se pueden acceder directamente desde el chat de GitHub Copilot. Esto permite que los usuarios puedan acceder a información adicional, como documentación, imágenes o cualquier otro recurso relevante, sin necesidad de salir del chat. Estos recursos se definen en el archivo `mcp-remote/src/resources/staticResources.ts`.


# Diferencia #6: Sampling

El sampling es una técnica fundamental en los modelos de lenguaje que consiste en seleccionar la siguiente palabra o token de una distribución de probabilidad, en lugar de elegir siempre la opción más probable. Esto permite generar respuestas más variadas, creativas y menos deterministas.

En la especificación MCP, se ha añadido soporte para configurar los parámetros de sampling directamente desde el servidor. Los parámetros más habituales que puedes ajustar son:

- **temperature**: Controla la aleatoriedad de las respuestas. Valores bajos (por ejemplo, 0.1-0.3) hacen que el modelo sea más conservador y repetitivo; valores altos (por ejemplo, 0.7-1.0) aumentan la creatividad y diversidad.
- **top_p (nucleus sampling)**: Limita la selección a un subconjunto de tokens cuya probabilidad acumulada no supera el valor de top_p (por ejemplo, 0.9). Esto ayuda a evitar respuestas incoherentes pero mantiene variedad.
- **top_k**: Limita la selección a los k tokens más probables. Por ejemplo, top_k=40 significa que solo se consideran los 40 tokens más probables en cada paso.

Gracias a este soporte, los desarrolladores pueden ajustar la creatividad y diversidad de las respuestas generadas por el modelo según el caso de uso: respuestas más precisas y seguras para tareas críticas, o más creativas y abiertas para brainstorming, generación de ideas, etc.

En MCP, estos parámetros pueden ser configurados desde el servidor y, en algunos casos, también expuestos al usuario final para que los ajuste según sus necesidades.


## MCP servers de ejemplo

En este repositorio he dejado dos ejemplos de servidores MCP que puedes usar para probar tanto el transporte stdio como sse. Estos servidores son muy simples y están creados en Node.js con Typescript. 

- `mcp-stdio`: Este servidor implementa el transporte stdio y permite interactuar con el modelo de lenguaje a través de la entrada y salida estándar. Puedes usarlo para probar el protocolo MCP en un entorno local.
- `mcp-remote`: Este servidor AHORA implementa el transporte Streameable HTTP y permite interactuar con el modelo de lenguaje a través de eventos del servidor. Puedes usarlo para probar el protocolo MCP en un entorno local.


## Ejecutar MCP Inspector

Para probar un mcp server puedes hacerlo usando directamente el Chat de Github Copilot pero hay veces que es más sencillo usar MCP Inspector. Para ello puedes lanzarlo usando este comando:

```bash
npx @modelcontextprotocol/inspector
```

Y ahora dentro del mismo puedes probar de forma guiada el flujo de autenticación OAuth 2.1, la interacción con el modelo de lenguaje y el uso de prompts y recursos estáticos.