# 🚀 Best Practices for Feature-Based Architecture in Node.js (Express + Prisma)

## 📁 1️⃣ Project Structure

### ✅ Follow a Feature-Based Folder Structure

Each module should contain controllers, services, and use cases.

```
src/
 ├── modules/
 │    ├── user/
 │    │    ├── controllers/
 │    │    │    ├── user.controller.ts
 │    │    ├── routes/
 │    │    │    ├── user.routes.ts
 │    │    ├── services/
 │    │    │    ├── createUser.service.ts
 │    │    │    ├── getUserById.service.ts
 │    │    ├── usecases/
 │    │    │    ├── createUserWithOrder.usecase.ts
 │    │    ├── validations/
 │    │    │    ├── createUserWithOrder.schema.ts
 │    ├── order/
 │    │    ├── services/
 │    │    ├── usecases/
 │    ├── shared/
 │    │    ├── prisma.ts
 │    │    ├── utils.ts
 │    │    ├── constants.ts
 │    ├── app.ts
 │    ├── server.ts
```

✅ **DO:**

- Group related files into modules (e.g., `user`, `order`).
- Separate concerns (Controllers, Services, Use Cases).
- Keep `shared/` for reusable utilities, constants, and Prisma.

🚫 **DON'T:**

- Mix business logic with controllers.
- Put everything inside a `services/` folder without separation.
- Keep all functions in a single file.

---

## 📌 2️⃣ Controllers: Only Handle HTTP Requests

✅ **DO:**

- Validate request data.
- Call **use cases**, not services directly.
- Return HTTP responses.

```typescript
import { prisma } from "@/shared/prisma";
import { createUserWithOrder } from "@/modules/user/usecases/createUserWithOrder.usecase";

export const handleCreateUserWithOrder = async (req, res) => {
	try {
		const { name, email, total } = req.body;

		const result = await prisma.$transaction((tx) =>
			createUserWithOrder({ name, email, total }, tx)
		);

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
```

🚫 **DON'T:**

- Write business logic inside controllers.
- Call `prisma` directly inside controllers.
- Return database objects as raw JSON.

---

## 📌 3️⃣ Use Cases: Orchestrate Business Logic

✅ **DO:**

- Call **multiple services** to perform a complete operation.
- Keep use cases **modular and reusable**.

```typescript
import { PrismaClient } from "@prisma/client";
import { createUser } from "@/modules/user/services/createUser.service";
import { createOrder } from "@/modules/order/services/createOrder.service";

export const createUserWithOrder = async (
	data: { name: string; email: string; total: number },
	tx: PrismaClient
) => {
	const user = await createUser({ name: data.name, email: data.email }, tx);
	const order = await createOrder({ userId: user.id, total: data.total }, tx);

	return { user, order };
};
```

🚫 **DON'T:**

- Write too much logic inside services.
- Call database queries directly inside controllers.
- Mix unrelated logic inside one use case.

---

## 📌 4️⃣ Services: Small, Reusable, and Focused

✅ **DO:**

- Each service should do **one** thing (CRUD operations).
- Use `tx: PrismaClient` for transactions.

```typescript
import { PrismaClient } from "@prisma/client";

export const createUser = async (
	data: { name: string; email: string },
	tx: PrismaClient
) => {
	return tx.user.create({ data });
};
```

🚫 **DON'T:**

- Mix multiple database operations inside one function.
- Handle transactions inside services (use cases should do that).

---

## 📌 5️⃣ Transactions: Always Use in Use Cases

✅ **DO:**

- Use `prisma.$transaction()` in **use cases** to ensure atomic operations.

🚫 **DON'T:**

- Call multiple services without wrapping them in a transaction.

---

## 📌 6️⃣ Error Handling: Use Middleware

✅ **DO:**

- Use a centralized error-handling middleware.

```typescript
export const errorHandler = (err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: err.message });
};
```

🚫 **DON'T:**

- Handle errors inside controllers repeatedly.

---

## 📌 7️⃣ Env & Config Management

✅ **DO:**

- Use `.env` files for secrets and configs.
- Use a config file to avoid hardcoded values.

🚫 **DON'T:**

- Store credentials in source code.
- Hardcode database URLs inside the code.

---

## 📌 8️⃣ Utility Functions: Store in `shared/utils.ts`

✅ **DO:**

- Store common functions in `shared/utils.ts`.

```typescript
export const formatResponse = (data) => {
	return { success: true, data };
};
```

🚫 **DON'T:**

- Repeat the same logic in multiple places.

---

## 📌 9️⃣ Logging: Use a Logger Instead of `console.log`

✅ **DO:**

- Use a logging library like `winston` or `pino`.

🚫 **DON'T:**

- Use `console.log()` in production.

---

## 📌 🔟 Security: Validate Input & Use Proper Auth

✅ **DO:**

- Use **Joi** or **Zod** for validation.
- Use **JWT** for authentication.

🚫 **DON'T:**

- Trust user input without validation.
- Use plaintext passwords (always hash them).

---

## 🔥 Summary: What to Do & Avoid

| ✅ **Do**                        | 🚫 **Don't**                          |
| -------------------------------- | ------------------------------------- |
| Use feature-based structure      | Put everything in `services/`         |
| Keep controllers thin            | Write logic inside controllers        |
| Use use cases for business logic | Call database queries in controllers  |
| Use transactions in use cases    | Handle transactions inside services   |
| Keep services small & reusable   | Mix multiple concerns in one function |
| Use error-handling middleware    | Handle errors manually in controllers |
| Store secrets in `.env`          | Hardcode values in code               |
| Use structured logging           | Use `console.log()`                   |
| Validate user input              | Trust user input                      |

---

## 🚀 Final Thoughts

Following these **best practices** will help you write **cleaner, more maintainable, and scalable** Node.js applications with Express and Prisma.

Would you like a **template repo** with this structure? Let me know! 🚀
