# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY ./apps/web/package*.json ./
RUN npm install --legacy-peer-deps

COPY ./apps/web ./
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY ./apps/web/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
