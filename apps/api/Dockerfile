# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only what's needed for installation and build
COPY ./apps/api/package*.json ./
RUN npm install --legacy-peer-deps

# Copy Prisma and source code
COPY ./apps/api/prisma ./prisma
COPY ./apps/api/tsconfig*.json ./
COPY ./apps/api/src ./src

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy built app and dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/src/main.js"]