FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --include=dev
RUN npm install ts-node tsconfig-paths --save-dev

COPY . .

EXPOSE 8080
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/main.ts"]
