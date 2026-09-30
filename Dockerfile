# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Enable pnpm via corepack (matching local version 10.24.0)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate


# Cache dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Production Stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
