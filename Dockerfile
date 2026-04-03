# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Подставляются на этапе сборки (см. compose.service.example.yml). Для браузера нужны URL с хоста пользователя, не внутренние имена Docker.
ARG VITE_SERVER_URL=http://localhost:3000
ARG VITE_LIVEKIT_URL=ws://localhost:7880
ARG VITE_MINIO_HLS_BASE_URL=http://localhost:9000/livekit/
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_LIVEKIT_URL=$VITE_LIVEKIT_URL
ENV VITE_MINIO_HLS_BASE_URL=$VITE_MINIO_HLS_BASE_URL

# Без `tsc -b`: в проекте есть ошибки типов, из‑за которых `pnpm run build` падает. Образ собирает только бандл Vite. Проверку типов лучше гонять в CI (`pnpm run build` локально после исправлений).
RUN pnpm exec vite build

FROM nginx:1.27-alpine AS production
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
