# ---- Build Stage ----
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["server.js"]