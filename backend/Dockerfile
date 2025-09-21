FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --include=dev

COPY . .

EXPOSE 3000

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/main.ts"]