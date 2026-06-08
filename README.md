# 🍕 Pizza App API

A REST API for managing a pizza restaurant application, built with TypeScript, Express.js, and Prisma.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- A [Cloudinary](https://cloudinary.com/) account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pizza-app.git
cd pizza-app/api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in the values in .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the `api/` directory with the following variables:

```env
PORT=3333
DATABASE_URL=postgresql://user:password@localhost:5432/pizza_app
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 16+ |
| **Web Framework** | Express.js | 5.2.1 |
| **Language** | TypeScript | 6.0.3 |
| **ORM** | Prisma | 7.8.0 |
| **Database** | PostgreSQL | - |
| **Authentication** | JWT | 9.0.3 |
| **Hashing** | bcryptjs | 3.0.3 |
| **File Upload** | Multer | 2.1.1 |
| **Cloud Storage** | Cloudinary | 2.10.0 |
| **Validation** | Zod | 4.4.3 |

---

## 📁 Project Structure

```
api/
├── src/
│   ├── controllers/          # HTTP request handling
│   │   ├── user/
│   │   ├── product/
│   │   └── category/
│   ├── services/             # Business logic
│   │   ├── user/
│   │   ├── product/
│   │   └── category/
│   ├── schemas/              # Zod validation schemas
│   ├── middlewares/          # Express middlewares
│   ├── config/               # Multer, Cloudinary config
│   ├── prisma/               # Prisma client
│   └── routes.ts             # Route definitions
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── prisma.config.ts
└── tsconfig.json
```

---

## 📱 Endpoints

### User
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/user` | Register new user | Public |
| POST | `/session` | Authenticate and get JWT | Public |
| GET | `/me` | Get authenticated user data | 🔒 |

### Category
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/category` | Create category | 🔒 Admin |
| GET | `/categories` | List all categories | 🔒 |

### Product
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/product` | Create product (with image upload) | 🔒 Admin |
| GET | `/products` | List all products | 🔒 |
| DELETE | `/product` | Delete product | 🔒 Admin |
| GET | `/category/product` | List products by category | 🔒 |

> Authenticated routes require the header: `Authorization: Bearer {token}`

---

## 🔐 Authentication

The API uses JWT for authentication. After logging in via `POST /session`, include the returned token in the `Authorization` header of all protected requests.

**User roles:**
- `STAFF` — Can view products and categories
- `ADMIN` — Full access, including creating and deleting products and categories

---

## 📤 Image Upload

Product images are uploaded as `multipart/form-data`. Files are stored temporarily in memory and then sent to Cloudinary.

**Restrictions:**
- Accepted formats: JPEG, JPG, PNG
- Maximum size: 4MB

---

## ⚠️ Error Handling

All errors are returned in the following format:

```json
{
  "error": "Descriptive error message here"
}
```

Validation errors (Zod) return status `400` with a detailed `errors` array.

---

## 🔗 References

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [Cloudinary](https://cloudinary.com/)
- 
