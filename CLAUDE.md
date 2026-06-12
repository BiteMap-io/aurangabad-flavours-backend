# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Run with hot reload (ts-node-dev, src/index.ts)
npm run build        # Compile TypeScript to dist/ (tsc)
npm start            # Run compiled output (node dist/index.js)
npm test             # Run Jest test suite
npm run format       # Prettier write over src/

# Run a single test file / test name
npx jest src/path/to/file.test.ts
npx jest -t "test name substring"
```

Local MongoDB for development (Mongo at `localhost:27017`, Mongo Express UI at `http://localhost:8081`):

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Seeding

Seed scripts connect to `MONGODB_URI`, mutate data, and call `process.exit`. Run against a dev DB only.

```bash
npm run seed         # Create default admin user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run seed-all     # Wipe + seed restaurants, articles, events, food-trails
# Also: seed-data, seed-articles, seed-events, seed-food-trails
```

## Architecture

Express + TypeScript REST API backed by MongoDB (Mongoose) with S3-compatible object storage. Strict layered, single-responsibility structure — each domain (restaurant, dish, article, event, foodTrail, gallery, media, user, settings, admin) has a parallel file in each layer:

```
routes/v1/<domain>.routes.ts  → controllers/<domain>.controller.ts → services/<domain>.service.ts → models/<domain>.model.ts
```

- **Routes** (`src/routes/v1/`) mount under `/v1` (see `routes/index.ts` → `routes/v1/index.ts`). They wire middleware, multer, and Swagger JSDoc annotations. The Swagger `@swagger` comment blocks in route files are the source of truth for the API docs served at `/api-docs`.
- **Controllers** parse/transform the HTTP request (FormData coercion, base64 decoding, file uploads to S3) and shape responses. They are exported as singleton instances with arrow-function methods (to preserve `this`).
- **Services** are thin wrappers around Mongoose models (CRUD). `RestaurantService` is a class instantiated per controller; most others follow the same pattern. No business logic beyond DB access lives here.
- **Models** (`src/models/`) are Mongoose schemas. Each exports a default `mongoose.model(...)` plus an `I<Name>` interface.

`src/app.ts` builds the Express app (helmet, CORS reflecting any origin, 50mb JSON/urlencoded limits, morgan). `src/index.ts` connects to Mongo then listens — but skips `app.listen` under Vercel (serverless export of `app`).

### Auth & roles

JWT bearer-token auth. Two middleware compose:

- `authenticate` (`middleware/auth.middleware.ts`) — verifies `Authorization: Bearer <token>`, sets `req.user` to the decoded payload (`{ id, email, name, userType }`).
- `authorize([roles])` (`middleware/authorize.middleware.ts`) — gates by `req.user.userType`.

User roles (`UserType` enum in `user.model.ts`): `admin`, `restaurant_owner`, `customer`. Admin-only mutations are protected with `authorize(['admin'])`. The JWT is signed in `user.controller.ts` (login/signup) with a 7-day expiry. Passwords are bcrypt-hashed in a Mongoose `pre('save')` hook; compare via the `comparePassword` instance method.

### File uploads & storage

- Routes use `multer` with `memoryStorage()` and a 50mb `fieldSize` limit (to accommodate base64 in text fields).
- `services/s3.service.ts` is a singleton wrapping `@aws-sdk/client-s3`, configured for **GCS or any S3-compatible endpoint** (`forcePathStyle: true`, strips the `x-id` query param GCS rejects, lazily auto-creates the bucket). Use `uploadBuffer(key, buffer, contentType)` / `deleteObject(key)` / `getFileUrl(key)`.
- Controllers handle two upload paths: real multipart files (`req.files`) and base64 strings in the JSON/form body (decoded via a `decodeBase64` helper). See `restaurant.controller.ts` for the canonical pattern, including parsing an uploaded `menu` xlsx/csv into `menuItems` via the `xlsx` lib and coercing FormData-flattened fields (e.g. `location[coordinates][0]`, JSON-stringified nested objects).

### Config

All env is centralized in `src/config/index.ts` (with defaults). Key vars (see `.env.example`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, and `S3_ENDPOINT`/`S3_REGION`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`/`S3_BUCKET`. Never read `process.env` directly in app code — add to the config object instead.

### Tests

Jest + ts-jest. `src/tests/setup.ts` (loaded via `setupFilesAfterEach`) spins up an in-memory MongoDB (`mongodb-memory-server`) per run and clears all collections after each test, so tests get a real but isolated DB. `dist/` is excluded from test resolution.

## Notes

- Deployment targets Vercel (`vercel.json` routes everything to `src/index.ts`) and a multi-stage `Dockerfile` (builds to `dist/`, runs `npm start`). The build must pass `tsc` under `strict: true`.
- `/api-docs` (Swagger UI) is gated by `localhostOnly` middleware and only reachable from localhost.
