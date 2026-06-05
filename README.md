# LCMS - Til O'quv Markazi Boshqaruv Tizimi

MERN stack (MongoDB, Express.js, React.js, Node.js) asosida yaratilgan til o'quv markazini boshqarish tizimi.

## Texnologiyalar

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, ExcelJS

**Frontend:** React (Vite), Redux Toolkit, RTK Query, Ant Design, Recharts, React Router v6

## O'rnatish

### Talablar
- Node.js v18+
- MongoDB (localhost:27017)

### Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

Server `http://localhost:5000` da ishga tushadi.

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend `http://localhost:3000` da ochiladi.

## Demo hisob

| Rol | Email | Parol |
|-----|-------|-------|
| Admin | admin@lcms.uz | Admin1234! |
| O'qituvchi | sardor@lcms.uz | Teacher123! |

## API

Barcha endpointlar `/api/v1` prefiksi ostida.

Asosiy modullar: Auth, Students, Groups, Teachers, Payments, Attendance, Grades, Reports.

## Seed ma'lumotlari

- 1 admin, 3 o'qituvchi
- 6 guruh (English, Russian, Chinese)
- 30 o'quvchi (har guruhda 5 ta)
- 3 oylik to'lov yozuvlari
- 2 haftalik davomat
- Namuna baholar
# lcms
