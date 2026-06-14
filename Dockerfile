# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (yarn)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build.
# REACT_APP_* vars come from .env.production and are inlined into the bundle here.
COPY . .
RUN yarn build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Bring over the built app and runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js

# next start listens on 3000 by default
EXPOSE 3000
CMD ["yarn", "start"]
