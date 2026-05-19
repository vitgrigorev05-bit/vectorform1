# 🚀 Деплой ВекторФорм на Vercel + Neon

Бесплатный production-стек: **Vercel** (фронт + API) + **Neon Postgres** (БД) + **ЮKassa** (платежи, подключается позже).

## Шаг 1 — База данных (Neon, ~3 минуты)

1. Зарегистрируйтесь на https://console.neon.tech (можно через GitHub).
2. **Create project** → имя `vectorforms`, регион ближе к EU (Frankfurt).
3. После создания откройте **Dashboard → Connection Details**, переключите на **Pooled connection** и скопируйте строку вида:
   ```
   postgresql://user:pass@ep-xyz-pooler.eu-central-1.aws.neon.tech/vectorforms?sslmode=require
   ```
4. Сохраните — пригодится в Шаге 3.

## Шаг 2 — Локальная проверка (опционально)

```bash
cp .env.example .env.local
# Вставьте DATABASE_URL из Neon и сгенерируйте NEXTAUTH_SECRET:
openssl rand -base64 32

# Применяем схему и сидим демо-данные
npm run db:push
npm run db:seed

# Запускаем
npm run dev
# → http://localhost:3000
```

Логин: `customer@demo.com` / `demo123` (есть также `author@`, `partner@`, `partner2@`, `admin@`).

## Шаг 3 — Деплой на Vercel

1. Зайдите на https://vercel.com → **Add New → Project**.
2. **Import** репозиторий `vectorform1` из GitHub.
3. На экране настроек:
   - **Framework Preset:** Next.js (определится сам).
   - **Build Command** уже задан в `vercel.json` — `prisma generate && prisma migrate deploy && next build`.
4. В разделе **Environment Variables** добавьте:
   | Имя | Значение |
   | --- | --- |
   | `DATABASE_URL` | строка из Neon (Шаг 1) |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://<имя-проекта>.vercel.app` (обновите после первого деплоя) |
5. **Deploy.** Первая сборка займёт 2-3 минуты, она автоматически создаст таблицы в Neon.
6. После первого деплоя выполните сид (один раз):
   ```bash
   # на вашей машине, с тем же DATABASE_URL из Vercel
   DATABASE_URL='postgresql://...' npm run db:seed
   ```

Готово — сайт работает.

## Шаг 4 — Платежи ЮKassa (когда будут реквизиты)

1. Зарегистрируйте магазин на https://yookassa.ru.
2. В **Настройках магазина** возьмите `shopId` и `Secret key`.
3. Добавьте в Vercel Environment Variables:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
4. Эндпоинт `/api/payments/yookassa/create` мы добавим в следующем шаге — каркас уже готов в `app/api/orders/route.ts`, статусы `PENDING_PAYMENT → PAID` ведутся.

## Шаг 5 — Хранилище файлов (продакшн)

Сейчас STL сохраняются в `public/uploads/` — на Vercel это **временное хранилище** (теряется между деплоями). Для прода подключите S3-совместимое:

- **Cloudflare R2** (10 ГБ бесплатно) — рекомендую.
- **AWS S3**.
- **MinIO** на своём сервере.

В `.env` добавьте `S3_*` переменные, и в `app/api/upload/route.ts` замените локальную запись на загрузку в S3 (отмечено `// На проде заменить на S3/R2`).

## Часто задаваемые вопросы

**Q: Куда смотреть логи?**
A: Vercel → ваш проект → Deployments → Functions → клик по эндпоинту.

**Q: Как добавить нового партнёра?**
A: Пользователь регистрируется как `CUSTOMER`, потом отправляет POST на `/api/partner/register` с компанией, тарифами, принтером и филаментом — роль автоматически становится `PARTNER`. Можно сделать UI-мастер в `/auth/register?role=partner` (TODO).

**Q: Как пересчитать стоимость, если партнёр изменил тариф?**
A: Новые заказы используют актуальные значения. Уже созданные `PrintCalculation` — снимок на момент оформления, не меняется (это намеренно — клиент видит цену, которую согласовал).
