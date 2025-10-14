
# ---- Build Stage ----
FROM alpine AS builder
RUN apk add --no-cache nodejs npm curl \
    && npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN rm -rf node_modules
RUN pnpm install --prod --frozen-lockfile

# ---- Production Stage ----
FROM alpine AS runner
RUN adduser -D appuser && apk add --no-cache nodejs
WORKDIR /app
# Only copy the built output and minimal files
COPY --from=builder /app/.next/standalone ./server

USER appuser
EXPOSE 3000
CMD ["node", "server/server.js"]

