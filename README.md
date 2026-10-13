# BuildKiwi

- **Live site:** [https://buildkiwi.space](https://buildkiwi.space)
- **Pattern Lab:** [https://buildkiwi-pattern-lab.pages.dev](https://buildkiwi-pattern-lab.pages.dev)
- **Repository:** Add your GitHub repository URL here

## Tech stack

| Area                | Technologies                                |
| ------------------- | ------------------------------------------- |
| Frontend            | React, TypeScript, Vite                     |
| Backend             | Node.js, Express 5, TypeScript              |
| Database            | MongoDB, Mongoose                           |
| Validation          | Zod, shared `@buildkiwi/validation` package |
| Authentication      | JWT, bcrypt                                 |
| Monorepo and builds | npm workspaces, Turborepo                   |
| Testing and quality | Vitest, Jest, ESLint, Prettier, TypeScript  |

Package names and folders may evolve as the project develops.

## Getting started

### Prerequisites

- Node.js (use a version compatible with the repository's `engines` field, if defined)
- npm
- A MongoDB database, such as a MongoDB Atlas cluster

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd buildkiwi
```

Replace `<YOUR_REPOSITORY_URL>` with the repository's HTTPS or SSH URL.

### 2. Install dependencies

Run this from the repository root:

```bash
npm install
```

### 3. Configure environment variables

Create the environment files expected by the API and frontend. Check the application's environment schema and configuration for the exact required names; do not commit real credentials.

The API needs a MongoDB connection string and authentication secrets. The frontend needs the API's base URL when it differs from its configured local default. Common configuration includes:

**API**

- `MONGO_URI` — MongoDB connection string.
- `JWT_ACCESS_SECRET` — secret used to sign access tokens.
- `JWT_REFRESH_SECRET` — secret used to sign refresh tokens.
- `NODE_ENV` — set to `development` locally and `production` in production.

**Frontend**

- `VITE_API_URL` — API base URL, including the `/api/v1` prefix if required by the app's configuration.

Use strong, unique secrets in each environment. Never publish `.env` files, API keys, database credentials, or production tokens.

### 4. Start development

From the repository root:

```bash
npm run dev
```

The root development command runs the configured workspace development tasks through Turborepo. Check each app's package scripts and terminal output for the local URLs and any additional setup required.

### 5. Run quality checks

The repository root provides scripts for the configured checks. Run the ones available in the current checkout:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Some scripts may invoke multiple workspace tasks through Turborepo.

## Deployment

BuildKiwi's frontend and API can be deployed separately. Configure production environment variables in the hosting providers rather than committing them to the repository.

Before deploying, verify:

- The frontend points to the production API using the correct `VITE_API_URL`.
- The API has a valid `MONGO_URI` and unique authentication secrets.
- CORS allows the intended frontend origin.
- Cookies, HTTPS, and production security settings are configured for the deployed domains.
- MongoDB network access is restricted to the required services.

Deployment configuration can change; use the current hosting configuration and application scripts as the source of truth.

## License

BuildKiwi is licensed under the [MIT License](LICENSE).

The MIT License applies to this project's code unless otherwise stated. Third-party dependencies, assets, and other included materials may be subject to their own licenses and terms.
