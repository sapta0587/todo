FROM node:20-alpine

# better-sqlite3 needs build tools on Alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
