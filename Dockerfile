# Usar Node.js como imagen base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Crear un usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcpserver -u 1001

# Cambiar la propiedad de los archivos al usuario mcpserver
RUN chown -R mcpserver:nodejs /app
USER mcpserver

# Exponer variables de entorno para el API key
ENV YOUTUBE_API_KEY=""

# Comando para ejecutar el servidor
CMD ["npm", "start"]
