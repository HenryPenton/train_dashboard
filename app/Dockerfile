
# # ---- Build Stage ----
# FROM node:24-alpine AS builder
# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN npm install -g pnpm && pnpm install --frozen-lockfile
# COPY . .
# RUN pnpm build

# # ---- Production Stage ----
# FROM node:24-alpine AS runner
# WORKDIR /app

# # Only copy the built output and minimal files
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/next.config.* ./
# COPY --from=builder /app/tailwind.config.js ./
# COPY --from=builder /app/postcss.config.* ./

# EXPOSE 3000
# CMD ["pnpm", "start"]

#
FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
