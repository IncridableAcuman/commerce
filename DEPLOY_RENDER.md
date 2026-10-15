# Render.com ga Deploy Qilish Bo'yicha To'liq Qo'llanma

Ushbu loyiha ma'lumotlar bazasi **Neon.com PostgreSQL** ga to'liq ko'chirilgan va **Render.com** platformasiga deploy qilish uchun to'liq tayyorlangan.

---

## 1. Loyiha Arxitekturasi

- **Ma'lumotlar bazasi:** Neon.tech Cloud PostgreSQL (Barcha jadvallar, triggerlar, ma'lumotlar va ketma-ketliklar ko'chirilgan).
- **Backend:** Spring Boot (Java 21, Docker).
- **Frontend:** React (Vite + Tailwind CSS), Render'da bepul va tezkor **Static Site** sifatida ishga tushadi.

---

## 2. 1-Usul: Render Blueprint orqali avtomatik deploy (Tavsiya etiladi 🚀)

Loyiha ildizida [`render.yaml`](./render.yaml) fayli mavjud. Bu fayl orqali Backend va Frontend bitta tugma bilan avtomatik sozlanadi:

1. O'zgarishlarni GitHub repositoriyangizga push qiling:
   ```bash
   git add .
   git commit -m "feat: migrate database to Neon and prepare Render deployment"
   git push origin main
   ```
2. [Render Dashboard](https://dashboard.render.com/) ga kiring.
3. Yuqori o'ng burchakdagi **New +** tugmasini bosing va **Blueprint** ni tanlang.
4. GitHub repositoriyangizni tanlang.
5. Render avtomatik ravishda `render.yaml` faylini aniqlaydi va quyidagi ikkita xizmatni yaratadi:
   - `commerce-backend` (Docker Web Service)
   - `commerce-frontend` (Static Site)
6. **Apply** tugmasini bosing. Render loyihani avtomatik qurib, ishga tushiradi!

---

## 3. 2-Usul: Qo'lda (Manual) Deploy qilish

Agar xizmatlarni Render konsolida alohida yaratmoqchi bo'lsangiz:

### A. Backend Web Service:
1. **New +** -> **Web Service**.
2. GitHub repositoriyangizni tanlang.
3. Sozlamalar:
   - **Name:** `commerce-backend`
   - **Language:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Docker Context:** `backend`
   - **Instance Type:** `Free`
   - **Health Check Path:** `/api/v1/actuator/health`
4. **Environment Variables** bo'limiga quyidagilarni kiriting:
   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `DB_URL` | `jdbc:postgresql://ep-hidden-dew-b4v4ibmp-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require` |
   | `DB_USERNAME` | `neondb_owner` |
   | `DB_PASSWORD` | `npg_JEqnA7b2NSQO` |
   | `JWT_SECRET` | `uzbekistan_uzbekistan_0123456789` |
   | `JWT_REFRESH` | `604800000` |
   | `JWT_ACCESS` | `900000` |
   | `MAIL_USERNAME` | `abdusharipovizzat03@gmail.com` |
   | `MAIL_PASSWORD` | `khgcufxqqhtmqxca` |
   | `CLIENT_URL` | `https://commerce-frontend.onrender.com` (yoki frontend domeningiz) |
   | `UPLOAD_DIR` | `/app/uploads` |
   | `ELASTICSEARCH_ENABLED` | `false` |
   | `SHOW_SQL` | `false` |
5. **Create Web Service** tugmasini bosing.

---

### B. Frontend Static Site:
1. **New +** -> **Static Site**.
2. GitHub repositoriyangizni tanlang.
3. Sozlamalar:
   - **Name:** `commerce-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL`: `https://commerce-backend.onrender.com/api/v1` *(commerce-backend o'rniga o'zingizning backend URL manzilingizni qo'ying)*
5. **Redirects / Rewrites** bo'limiga Single Page Application (SPA) uchun marshrut qo'shing:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
6. **Create Static Site** tugmasini bosing.

---

## 4. Muhim Eslatmalar

- **CORS:** Backend avtomatik tarzda `https://*.onrender.com` domenlarini va `CLIENT_URL` qiymatini qabul qiladi.
- **Healthcheck:** `/api/v1/actuator/health` tekshiruvi Neon PostgreSQL bazasiga ulanishni nazorat qiladi.
- **DatabaseConfig:** Backend avtomatik tarzda standart `postgresql://...` URL manzilini ham JDBC formatiga moslab oladi.
