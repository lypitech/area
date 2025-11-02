# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

# Install serve (a simple static file server)
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Create public directory for the APK
RUN mkdir -p ./public

EXPOSE 8081

# Serve both the built app and public directory
# The public directory will be accessible at /public/*
CMD ["sh", "-c", "cp -r ./public/* ./dist/ 2>/dev/null || true && serve -s dist -l 8081"]
