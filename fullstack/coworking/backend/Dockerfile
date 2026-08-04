# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# O engine do Prisma precisa de OpenSSL — a imagem alpine não vem com ele.
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
RUN npx prisma generate

EXPOSE 3333

# Aplica as migrations pendentes e só então sobe o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
