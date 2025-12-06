# Node most current version
ARG NODE_VERSION=24

# Dependencies
FROM node:${NODE_VERSION}-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema=./lib/prisma/schema.prisma
RUN npm run build

# Runner
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Non-root user
RUN adduser -S nextjs -G node

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]