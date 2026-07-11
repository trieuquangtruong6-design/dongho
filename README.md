# Dang Quang Watch

Website ban dong ho va phu kien, co gio hang, dat hang, tai khoan khach hang va trang quan tri.

## Link demo

- Website: https://dongho-theta.vercel.app
- Admin: https://dongho-theta.vercel.app/admin

## Tai khoan admin demo

- Email: `admin@dangquangwatch.vn`
- Mat khau: `Admin@123456`

## Chuc nang chinh

- Xem danh sach san pham theo danh muc.
- Xem chi tiet san pham.
- Them san pham vao gio hang va dat hang.
- Dang ky, dang nhap tai khoan khach hang.
- Quan tri don hang.
- Quan tri san pham: them, sua, xoa, cap nhat san pham len shop.
- Quan tri khach hang/nguoi dung.

## Cong nghe su dung

- React + TypeScript + Vite
- Express API
- Prisma ORM
- PostgreSQL/Supabase
- Vercel deploy

## Bien moi truong

Can tao file `.env` khi chay local:

```env
DATABASE_URL="..."
DIRECT_URL="..."
JWT_SECRET="..."
```

## Chay local

```bash
npm install
npm run db:push
npm run db:seed
npm run admin:create
npm run dev
```

Sau khi chay local, mo:

```text
http://localhost:3000
```
