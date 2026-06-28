FROM node:18

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server/ .

EXPOSE 8080

CMD ["node", "server.js"]