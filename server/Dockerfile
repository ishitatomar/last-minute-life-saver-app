FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

RUN ls -R /app

CMD ["node", "server/server.js"]