# Node most current version
ARG NODE_VERSION=24

# Dependencies
FROM node:${NODE_VERSION}-alpine AS Dependeinces
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM node:${NODE_VERSION}-alpine as Builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=Dependeinces /app/node_modules ./node_modules
COPY . .
RUN npm run Builder

# Runner
FROM node:${NODE_VERSION}-alpine AS Runner
WORKDIR /app

# Non-root user
RUN addgroup -S node && adduser -S nextjs -G node

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]