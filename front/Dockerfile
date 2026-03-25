# Stage 1: Build React app
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (node_modules & dist ignored by .dockerignore)
COPY . .

# Build production version
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
