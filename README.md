# ¿Qué es Model Context Protocol?

Model Context Protocol (MCP) es un protocolo que permite a los modelos de lenguaje interactuar con otros sistemas y servicios a través de un conjunto de APIs estandarizadas. Esto permite a los modelos de lenguaje acceder a información externa y realizar acciones en otros sistemas, lo que amplía su funcionalidad y utilidad. En la documentación oficial se compara con un USB-C, que permite conectar diferentes dispositivos y sistemas.

# De qué se compone el MCP

- **MCP Server**: Es el servidor que implementa el protocolo y permite a los modelos de lenguaje interactuar con otros sistemas y servicios. El MCP Server actúa como intermediario entre el modelo de lenguaje y los sistemas externos.
- **Algo con un cliente MCP**: Es el cliente que se conecta al MCP Server y envía solicitudes para interactuar con otros sistemas y servicios. El MCP Client puede ser un modelo de lenguaje o cualquier otro sistema que necesite interactuar con el MCP Server. Este puede ser la apliación de escritorio de Claude o un IDE como Visual Studio Code y GitHub Copilot Chat 😃.

# MCP servers


# preguntas para el mcp server de mcp-server-time

- `qué hora es en Madrid`


# preguntas para el mcp server de GitHub

- `qué issues tengo en returngis/dragons-api`
- `qué pull request tengo en returngis/dragons-api`
