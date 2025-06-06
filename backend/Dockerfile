FROM node:20-alpine

WORKDIR /app

# Copia apenas o package*.json para instalar dependências
COPY package*.json ./

RUN npm install

# Copia a pasta 'dist' já compilada do host para o container
COPY dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]