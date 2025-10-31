# syntax=docker/dockerfile:1

### Stage 1: Build the application ###
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifests and lockfile
COPY package.json package-lock.json* ./

# Install dependencies (this will cache your dependencies)
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Build the NestJS app (adjust the build command if needed)
RUN npm run build

### Stage 2: Create the production image ###
FROM node:20-alpine
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/drizzle.config.ts ./

# Add these near the top of your Dockerfile
ARG NODE_ENV=production
ARG EXECUTE_SCRIPT

# Set an environment variable to use the port
ENV PORT=80
# Environment variables need to be set with ENV to be available at runtime
ENV NODE_ENV=${NODE_ENV}
ENV EXECUTE_SCRIPT=${EXECUTE_SCRIPT}
ENV PORT=5456

EXPOSE $PORT

# Serve the app with cross-env and npm start
CMD ["sh", "-c", "export NODE_ENV=${NODE_ENV} && npx drizzle-kit push && npm run ${EXECUTE_SCRIPT}"]
