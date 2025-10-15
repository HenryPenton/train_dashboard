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
FROM node:24-alpine AS runner
WORKDIR /app

# Copy only necessary files for standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

