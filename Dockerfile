# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .
COPY .env .env

# Build the Next.js app
RUN npm run build

# Stage 2: Run the built app
FROM node:18-alpine AS runner
WORKDIR /app

# Copy node_modules and .next from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Opsional: copy next.config.js, tsconfig.json jika ada
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose port Next.js (default 3000)
EXPOSE 3000

# Start server
CMD ["npm", "start"]