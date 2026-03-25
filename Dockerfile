# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port (assuming 4000 based on config)
EXPOSE 4000

# Set environment variables (these can be overridden by docker-compose)
ENV PORT=4000
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
