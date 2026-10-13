# 🛍️ E-Commerce Full Stack Application

Zamonaviy, xavfsiz va to'liq konteynerlashtirilgan E-Commerce platformasi. Loyiha **Spring Boot 3 (Java 21)** backend, **React 19 + TypeScript + Vite + Tailwind CSS** frontend va **Zustand** state boshqaruvi bilan yaratilgan.

---

## 🚀 Texnologiyalar steki

### Backend
- **Til / Platforma:** Java 21 (OpenJDK / Eclipse Temurin)
- **Freymvork:** Spring Boot 3.4.1
- **Xavfsizlik:** Spring Security, JJWT 0.12.6, Google OAuth2 Client
- **Ma'lumotlar bazasi:** PostgreSQL 16 (Spring Data JPA / Hibernate)
- **Kesh & OTP:** Redis 7 (Spring Data Redis)
- **Xabarlar navbati (Message Broker):** RabbitMQ 3.x
- **Monitoring:** Spring Boot Actuator
- **Testlash:** JUnit 5, Mockito, Spring Security Test, Spring Rabbit Test

### Frontend
- **Freymvork:** React 19, TypeScript
- **Yig'uvchi (Bundler):** Vite
- **State Management:** Zustand
- **Marshrutlash (Routing):** React Router 7
- **Formalar & Validatsiya:** React Hook Form + Zod
- **Stilizatsiya:** Tailwind CSS, Framer Motion, Lucide React
- **HTTP Client:** Axios (Interceptor & Auto-Refresh)
- **Veb Server (Production):** Nginx (Reverse Proxy & SPA Caching)

---

## 🐳 Docker orqali ishga tushirish (Production Ready)

Loyiha to'liq **Docker Compose** orqali bitta buyruq bilan ishga tushiriladi:

```bash
# 1. Loyiha ildiz papkasiga o'ting
cd /path/to/commerce

# 2. .env faylini tekshiring yoki .env.example dan nusxa oling
cp .env.example .env

# 3. Barcha konteynerlarni yig'ish va fonda ishga tushirish
docker compose up -d --build
```

### Konteynerlar holatini tekshirish
```bash
docker compose ps
```

### Loglarni kuzatish
```bash
# Barcha loglar
docker compose logs -f

# Faqat backend loglari
docker compose logs -f backend

# Faqat frontend loglari
docker compose logs -f frontend
```

### Konteynerlarni to'xtatish
```bash
docker compose down
```

---

## 🌐 Xizmatlar portlari va manzillari

| Xizmat | Ichki manzil | Tashqi Port | Izoh |
|---|---|---|---|
| **Frontend (Nginx)** | `http://localhost:3000` | `3000` | Asosiy veb-ilova va reverse proxy |
| **Backend API** | `http://localhost:8080/api/v1` | `8080` | REST API |
| **Backend Health** | `http://localhost:8080/api/v1/actuator/health` | `8080` | Salomatlik tekshiruvi (Healthcheck) |
| **PostgreSQL** | `localhost:5432` | `5432` | Asosiy ma'lumotlar bazasi |
| **Redis** | `localhost:6379` | `6379` | Kesh va OTP saqlagich |
| **RabbitMQ AMQP** | `localhost:5672` | `5672` | Asinxron xabarlar almashinuvi |
| **RabbitMQ Management** | `http://localhost:15672` | `15672` | RabbitMQ boshqaruv paneli |

---

## 🔑 Autentifikatsiya tizimi imkoniyatlari

1. **Email orqali ro'yxatdan o'tish**:
   - `POST /api/v1/auth/register` $\rightarrow$ Yangi foydalanuvchi yaratiladi, 6 xonali OTP Redisga saqlanib emailga yuboriladi.
2. **Emailni tasdiqlash (OTP)**:
   - `POST /api/v1/auth/verify-email` $\rightarrow$ OTP tasdiqlangach foydalanuvchi hisobi faollashadi (`enabled=true`), JWT Access Token va HTTP-Only Refresh Token Cookie beriladi.
3. **Kodni qayta yuborish (Resend OTP)**:
   - `POST /api/v1/auth/resend-otp` $\rightarrow$ Yangi OTP kod Redisga yangilanib yuboriladi.
4. **Tizimga kirish (Login)**:
   - `POST /api/v1/auth/login` $\rightarrow$ Parol va faollik tekshiriladi, tokenlar taqdim etiladi.
5. **Google OAuth2 Autentifikatsiyasi**:
   - Brauzer redirect oqimi: `http://localhost:8080/api/v1/oauth2/authorization/google`
   - REST API orqali kirish: `POST /api/v1/auth/google` (Google Token bilan)
6. **Tokenni yangilash (Refresh Token)**:
   - `GET /api/v1/auth/refresh` $\rightarrow$ HTTP-Only Cookie dagi refresh token orqali yangi access token olinadi.
7. **Joriy foydalanuvchi ma'lumotlari**:
   - `GET /api/v1/auth/me` $\rightarrow$ Tizimga kirgan foydalanuvchi ma'lumotlari (`id`, `fullName`, `username`, `email`, `role`, `avatar`, `enabled`).
8. **Parolni tiklash**:
   - `POST /api/v1/auth/forgot-password` $\rightarrow$ Tiklash havolasi emailga yuboriladi.
   - `PUT /api/v1/auth/reset-password` $\rightarrow$ Token orqali yangi parol o'rnatiladi.
9. **Chiqish (Logout)**:
   - `POST /api/v1/auth/logout` $\rightarrow$ Bazadagi refresh token o'chiriladi va cookie tozalanadi.

---

## 🧪 Testlarni ishga tushirish (Backend)

```bash
cd backend
./gradlew test
```
Barcha Unit va Integration testlar (`AuthServiceTest`, `AuthControllerTest`, `BackendApplicationTests`) to'liq muvaffaqiyatli o'tadi.

---

## 💻 Mahalliy ishlab chiqish (Development Mode)

### Backend
```bash
cd backend
./gradlew bootRun
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```