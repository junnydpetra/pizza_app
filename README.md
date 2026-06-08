# Project Context - Pizza App API

## 📋 Executive Summary

**Pizza App** is a REST API for managing a pizza restaurant application, built in TypeScript with Express.js and Prisma. The application follows a layered architecture with a clear separation of concerns between Controllers, Services, and the Database.

---

## 🏗️ General Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 16+ (inferred from TypeScript) |
| **Web Framework** | Express.js | 5.2.1 |
| **Language** | TypeScript | 6.0.3 |
| **ORM** | Prisma | 7.8.0 |
| **Database** | PostgreSQL | 8.21.0 |
| **Authentication** | JWT | 9.0.3 |
| **Hashing** | bcryptjs | 3.0.3 |
| **File Upload** | Multer | 2.1.1 |
| **Cloud Storage** | Cloudinary | 2.10.0 |
| **Validation** | Zod | 4.4.3 |
| **CORS** | cors | 2.8.6 |
| **Environment Variables** | dotenv | 17.4.2 |
| **Build Tool** | tsx | 4.22.3 |

### Directory Structure

```
api/
├── src/
│   ├── controllers/          # Presentation layer (HTTP requests)
│   │   ├── user/
│   │   ├── product/
│   │   └── category/
│   ├── services/             # Business logic
│   │   ├── user/
│   │   ├── product/
│   │   └── category/
│   ├── schemas/              # Zod validation schemas
│   ├── middlewares/          # Express middlewares
│   ├── config/               # Configurations (multer, cloudinary)
│   ├── prisma/               # Prisma client
│   ├── @types/               # Custom type definitions
│   ├── server.ts             # Main entry point
│   └── routes.ts             # Route definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── dist/                     # Compiled code
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── package-lock.json
```

---

## 🔄 Layered Architecture Pattern

### 1. **Controllers** (Presentation Layer)

Responsible for:
- Receiving HTTP requests
- Extracting data from `req.body`
- Calling services
- Returning HTTP responses

```typescript
// Pattern: /src/controllers/{domain}/{ActionController}.ts
class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            name, email, password
        });
        res.json(user);
    }
}
```

**Conventions:**
- Classes named with `Controller` suffix
- Async `handle` method receiving `Request` and `Response`
- Direct service instantiation (no dependency injection)
- No business logic, only orchestration

### 2. **Services** (Business Logic Layer)

Responsible for:
- Implementing business rules
- Business validation
- Database operations
- External API calls

```typescript
// Pattern: /src/services/{domain}/{ActionService}.ts
interface CreateUserProps {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, password }: CreateUserProps) {
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: { email }
        });

        if (userAlreadyExists?.email) {
            throw new Error("Error! Email already registered.");
        }

        const passwordHash = await hash(password, 8);
        const user = await prismaClient.user.create({
            data: { name, email, password: passwordHash },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return user;
    }
}
```

**Conventions:**
- Classes named with `Service` suffix
- `{Action}Props` interface for parameter typing
- Async `execute` method with input interface
- Explicit field selection in Prisma (never returns passwords)
- Business validations using `throw new Error()`

### 3. **Routes** (Routing Layer)

```typescript
// /src/routes.ts
router.post("/user", 
    validateSchema(createUserSchema), 
    new CreateUserController().handle
);

router.get("/me", 
    isAuthenticated, 
    new DetailUserController().handle
);

router.post("/category",
    isAuthenticated,
    isAdmin,
    validateSchema(categorySchema),
    new CreateCategoryController().handle
);
```

**Pattern:**
- Middlewares applied in order: validation → authentication → authorization → controller
- Controllers instantiated inline with access to the `handle` method
- HTTP methods: GET (read), POST (create), DELETE (delete)

---

## 🔐 Security and Authentication

### JWT (JSON Web Token)

**Flow:**
1. User logs in via POST `/session` with email/password
2. Service validates credentials and generates JWT using `jsonwebtoken`
3. Token includes `sub` (subject) = `user_id`
4. Client sends token in header: `Authorization: Bearer {token}`
5. `isAuthenticated` middleware validates and extracts `user_id` into `req.user_id`

**Code:**
```typescript
// Token generation (in AuthUserService)
const token = sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
});

// Token validation (isAuthenticated middleware)
const { sub } = verify(token, process.env.JWT_SECRET!) as { sub: string };
req.user_id = sub;
```

### Authentication

- **Middleware:** `isAuthenticated` - validates JWT
- **Usage:** Protect routes requiring an authenticated user
- **Extraction:** Token via `Authorization: Bearer {token}` header

### Authorization (Roles)

```typescript
// isAdmin middleware
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user_role !== "admin") {
        return res.status(401).json({ error: "You do not have permission!" });
    }
    next();
}
```

**Observed Roles:**
- `admin` - Can create categories, products, etc.
- `user` - Can view products

---

## ✅ Validation with Zod

All input schemas are validated with Zod before reaching the controller.

```typescript
// /src/schemas/userSchema.ts
export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "The name must be a text!" })
            .min(3, { message: "The name must have at least 3 characters!" }),
        email: z.email({ message: "The email address must be a valid email address!" }),
        password: z
            .string({ message: "A password is required!" })
            .min(6, { message: "The password must have at least 6 characters!" })
    })
});
```

**Validation Middleware:**
```typescript
export function validateSchema(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
        }
    };
}
```

**Convention:**
- One schema per action (create, update, etc.)
- Error messages in English (project standard)
- Validation occurs in the middleware, before the controller

---

## 📤 File Upload

### Multer Configuration

```typescript
// /src/config/multer.ts
export default {
    storage: multer.memoryStorage(),  // Stores in memory
    limits: {
        fileSize: 4 * 1024 * 1024  // 4MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, JPG, and PNG formats are allowed!"));
        }
    }
};
```

**Pattern:**
- In-memory storage (not on disk)
- Maximum 4MB per file
- Only JPEG, JPG, PNG allowed
- File accessible via `req.file.buffer`

### Cloudinary Integration

Images are uploaded to Cloudinary after upload:

```typescript
// In CreateProductService
const uploadStream = cloudinary.uploader.upload_stream({
    folder: "products",
    resource_type: "image",
    public_id: `${Date.now()}-${imageName.split(".")[0]}`
}, (error, result) => {
    if (error) reject(error);
    else resolve(result);
});

const bufferStream = Readable.from(imageBuffer);
bufferStream.pipe(uploadStream);
```

**Configuration:**
```typescript
// /src/config/cloudinary.ts
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
```

---

## 📊 Business Domains

### 1. **User**

**Entities:**
- `user` - System user

**Operations:**
- `CreateUserService` - POST `/user` - Register new user
- `AuthUserService` - POST `/session` - Authenticate and generate JWT
- `DetailUserService` - GET `/me` - Get authenticated user details

**Security:**
- Passwords are hashed with bcryptjs (salt=8)
- Never return password in response (use `select`)
- Unique email per user

### 2. **Category**

**Entities:**
- `category` - Product category (e.g. Pizza, Drink, Dessert)

**Operations:**
- `CreateCategoryService` - POST `/category` - Create category (admin only)
- `ListCategoryService` - GET `/categories` - List categories

**Rules:**
- Only admins can create categories

### 3. **Product**

**Entities:**
- `product` - Menu item

**Operations:**
- `CreateProductService` - POST `/product` - Create product (admin + multer)
- `ListProductService` - GET `/products` - List products
- `DeleteProductService` - DELETE `/product` - Delete product (admin only)
- `ListProductByCategoryService` - GET `/category/product` - List products by category

**Rules:**
- Image upload required via Multer
- Image stored in Cloudinary
- Only admins can create/delete products
- Product linked to a category

---

## 🔑 Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/pizza_app

# Server
PORT=3333
JWT_SECRET=your_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📝 Naming Conventions

### Classes
- Controllers: `{Action}{Domain}Controller` (e.g. `CreateUserController`)
- Services: `{Action}{Domain}Service` (e.g. `CreateUserService`)
- Schemas: `{domain}Schema` (e.g. `userSchema`)

### Files
- Directories: snake_case, separated by domain
- TypeScript files: PascalCase (class files), camelCase (utility files)
- Examples:
  - `src/controllers/user/CreateUserController.ts`
  - `src/services/product/ListProductService.ts`
  - `src/config/multer.ts`

### Interfaces and Types
- Interface for service props: `{Action}{Domain}Props`
- Examples: `CreateUserProps`, `CreateProductProps`

---

## 🚀 Scripts and Build

### Package.json Scripts

```json
{
    "dev": "tsx watch src/server.js"
}
```

**Commands:**
- `npm run dev` - Starts server in watch mode with tsx

### TypeScript Configuration

**tsconfig.json highlights:**
- Target: `ES2020`
- Module: `node16`
- Strict mode: `true` (all strict checks enabled)
- `noUnusedLocals` and `noUnusedParameters` enabled
- `sourceMap` active for debugging
- Output: `./dist`

---

## 🗄️ Database

### Main Entities

```prisma
model User {
    id       String    @id @default(cuid())
    name     String
    email    String    @unique
    password String
    role     String    @default("user")  // "user" or "admin"
    createdAt DateTime  @default(now())
}

model Category {
    id       String    @id @default(cuid())
    name     String
    createdAt DateTime  @default(now())
    products Product[]
}

model Product {
    id          String    @id @default(cuid())
    name        String
    price       Float
    description String
    banner      String    // Cloudinary URL
    category_id String
    category    Category  @relation(fields: [category_id], references: [id])
    createdAt   DateTime  @default(now())
}
```

---

## ⚠️ Error Handling

### Global Pattern

```typescript
// In server.ts - global error middleware
app.use((error: Error, _: Request, res: Response, next: NextFunction) => {
    if (error instanceof Error) {
        return res.status(400).json({
            error: error.message
        });
    }
    return res.status(500).json({
        error: "Internal server error!"
    });
});
```

**Pattern:**
- Services throw `Error` with descriptive messages
- Controllers do no error handling (propagates to global middleware)
- Global middleware catches and returns JSON with appropriate status

---

## 📱 Endpoints

### User
- `POST /user` - Create user
- `POST /session` - Authenticate
- `GET /me` - Authenticated user data

### Category
- `POST /category` - Create category (admin)
- `GET /categories` - List categories

### Product
- `POST /product` - Create product (admin + multer)
- `GET /products` - List products
- `DELETE /product` - Delete product (admin)
- `GET /category/product` - List by category

---

## 🎯 Observed Best Practices

1. ✅ **Separation of concerns** - Controllers, Services, and Database separated
2. ✅ **Strong typing** - TypeScript with strict mode enabled
3. ✅ **Middleware-layer validation** - Zod in middleware
4. ✅ **Security** - Password hashing, JWT, role-based authorization
5. ✅ **Explicit field selection** - Never returns sensitive data
6. ✅ **Domain-based organization** - Separate folders per entity
7. ✅ **Centralized configuration** - Dotenv for environment variables
8. ✅ **Global error handling** - Centralized error middleware

---

## 🔄 Request Flow (Example: Create User)

```
1. POST /user { name, email, password }
   ↓
2. validateSchema middleware - Validates with Zod
   ↓
3. CreateUserController.handle()
   ↓
4. CreateUserService.execute()
   - Checks if email already exists
   - Hashes the password
   - Creates user in Prisma
   - Returns user without password
   ↓
5. Response: { id, name, email, role, createdAt }
```

---

## 📚 Suggested Next Implementations

- [ ] Implement unit tests (Jest)
- [ ] Add pagination to listings
- [ ] Implement refresh token
- [ ] Rate limiting
- [ ] Structured logging
- [ ] Swagger/OpenAPI documentation
- [ ] Role validation on user detail endpoint

---

## 🔗 Useful References

- TypeScript: https://www.typescriptlang.org/
- Express: https://expressjs.com/
- Prisma: https://www.prisma.io/
- Zod: https://zod.dev/
- JWT: https://jwt.io/
- Cloudinary: https://cloudinary.com/
