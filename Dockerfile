# Multi-stage Dockerfile for LTK Astro website

# Development stage
FROM node:18-alpine as development

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=development
ENV ASTRO_HOST=0.0.0.0
ENV ASTRO_PORT=4321

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --include=dev

# Copy source code
COPY . .

# Expose development port
EXPOSE 4321

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4321/ || exit 1

# Development command
CMD ["npm", "run", "dev"]

# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

# Install system dependencies for build
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Type check
RUN npm run check

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine as production

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx website
RUN rm -rf ./*

# Copy built application from build stage
COPY --from=build /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check for production
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Add labels for container metadata
LABEL maintainer="LTK Development Team" \
      version="1.0" \
      description="League The k4sen (LTK) 2025 Tournament Website" \
      org.opencontainers.image.title="LTK Astro Website" \
      org.opencontainers.image.description="League The k4sen Tournament Website built with Astro and TypeScript" \
      org.opencontainers.image.version="1.0" \
      org.opencontainers.image.source="https://github.com/ltk-tournament/website"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]