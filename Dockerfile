# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the Prisma client
COPY ./src/prisma ./src/prisma
COPY ./prisma ./prisma
RUN npx prisma generate || true

# Copy all files
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
RUN npm run build

# Production image, copy only necessary files
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]