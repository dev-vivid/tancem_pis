# 🚀 TANCEM PIS

## 📌 Getting Started

To start the application, run the following command in the terminal:

```sh
npm run dev
```

> **Note:** As this application uses the `npm` instead of `npm` please avoid using `npm` in any comand

## 📦 Creating modules

To create a module run the following command in terminal:

```
npm run module <moduleName> <version>
```

> **Note:** `moduleName` should be in lower camelCase and the `version` is optional, by default the version will be set to `v1`

This boilerplate code is generated using the `createModule.js` file. So Please be careful while accessing the particular file.s

## 📑 Templates or snippets

Use the vscode snippets to create the prisma model and other boilerplate codes which is used in this project. If you are using a frequent boilerplates make it as a template with proper descriptions in `.vscode` folder. And you also can refer the snippets to use them

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```ini
NODE_ENV=local
APP_PORT=8009
APP_BASE_PATH="pis"

# Base URL to access other microservices
MICROSERVICE_BASE_URL="https://tancem-develop.com/tancem"

# URL path for validating user sessions
SESSION_VALIDATION_URL="/um/v1/auth/session/validate"

# Secrets
DATABASE_URL=xxxx
```

> **Note:** Get all the `Secrets` values from the other team members.

---

## 📖 Documentation

For detailed guidelines and best practices, refer to:

- [📘 Best Practices](docs/guide/best_practices.md) – Project structure, coding standards, and architecture best practices.
- [📘 Validation Practices](docs/guide/validation_practices.md) – Input validation strategies and usage of `Joi`.

---

## 📬 Feedback & Contributions

If you have suggestions or improvements, feel free to raise a pull request or discuss them with the team. Happy coding! 🚀

## 🟥 Please note

> 1. If there is any improvement and you want to make changes. Please make a copy of the feature and modify it.

> 2. If you have a clear idea about the changes and want to modify it without creating new copy of the feature please discuss with the team
