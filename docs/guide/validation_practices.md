# 📌 Global Request Validation in Express (Best Practices)

## 🚀 Why Use Global Validation Middleware?
Using a centralized validation middleware ensures that request data is always validated before reaching the controllers. This approach keeps controllers clean, improves maintainability, and provides a consistent error-handling mechanism across your application.

## ✅ Implementing Global Validation with Joi

### 1️⃣ Create a Global Validation Middleware
This middleware will validate requests based on Joi schemas.

#### 📂 `src/shared/middlewares/validateRequest.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }

    next();
  };
};
```

---

### 2️⃣ Define Joi Validation Schemas
Define validation schemas separately to ensure maintainability.

#### 📂 `src/modules/user/validations/user.schema.ts`
```typescript
import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
```

---

### 3️⃣ Apply Middleware to Routes
Use `validateRequest` in routes to apply validation.

#### 📂 `src/modules/user/routes/user.routes.ts`
```typescript
import express from 'express';
import { handleCreateUser } from '../controllers/user.controller';
import { validateRequest } from '@/shared/middlewares/validateRequest';
import { createUserSchema } from '../validations/user.schema';

const router = express.Router();

router.post('/create', validateRequest(createUserSchema), handleCreateUser);

export default router;
```

---

## 🔥 Extended Middleware for Query & Params Validation
Modify the middleware to handle **query parameters** or **route parameters**:

```typescript
export const validateRequest = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }

    next();
  };
};
```

Now, validate **query parameters** in routes:

```typescript
router.get('/users', validateRequest(getUserSchema, 'query'), handleGetUsers);
```

---

## 📌 Benefits of Global Validation Middleware

| ✅ **Pros** | ❌ **Cons** |
|------------|------------|
| Keeps controllers clean | Requires maintaining separate schemas |
| Reusable across all routes | Slight extra setup |
| Standardizes validation errors | - |
| Supports body, query, and params validation | - |

---

## 🎯 Conclusion
Using a global validation middleware improves the **scalability, maintainability, and security** of your Express application. It ensures that only valid data reaches your business logic, reducing potential bugs and security issues.

🔹 **Want more enhancements?** Consider adding **custom error handling** and integrating **logging mechanisms** for debugging validation failures!

