# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for API key
ARG GEMINI_API_KEY

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application with the API key
RUN GEMINI_API_KEY=$GEMINI_API_KEY npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
