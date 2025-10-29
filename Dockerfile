FROM node:18-alpine
WORKDIR /hotel/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3005

ENV NODE_ENV=production

CMD ["node", "src/server.js"]