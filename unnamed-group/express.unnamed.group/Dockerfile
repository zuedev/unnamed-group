FROM node:23-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80
EXPOSE 13337/udp

CMD ["npm", "start"]