# ==========================================
# 1-Bosqich: Build (Node.js 22 Alpine)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Dependency fayllarini nusxalash (keshlash uchun)
COPY package.json package-lock.json ./

# Toza va barqaror paketlarni o'rnatish
RUN npm ci

# Manba kodini nusxalash
COPY . .

# Build argumentlari (agar kerak bo'lsa)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Production build yaratish
RUN npm run build

# ==========================================
# 2-Bosqich: Production Runtime (Nginx Alpine)
# ==========================================
FROM nginx:1.27-alpine

LABEL maintainer="izzatbek"
LABEL description="Commerce Frontend Nginx Container"

# Standart fayllarni o'chirish
RUN rm -rf /usr/share/nginx/html/*

# Yig'ilgan dist fayllarini ko'chirish
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx konfiguratsiya faylini nusxalash
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80
EXPOSE 3000

# Salomatlik tekshiruvi (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
