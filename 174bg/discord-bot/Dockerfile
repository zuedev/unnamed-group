FROM node:24-alpine
WORKDIR /app
RUN apk add --no-cache git python3 make g++
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "main.js"]