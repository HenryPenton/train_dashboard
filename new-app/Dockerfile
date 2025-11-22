
# ---- Dependencies Stage ----
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile

# ---- Build Environment ----
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm 
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/pnpm-lock.yaml ./
COPY . .

RUN pnpm build

# ---- Production Stage ----
FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["server.js"]