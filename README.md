# Aurangabad Flavours — Backend (TS)

Basic TypeScript Express backend scaffold using MongoDB (Mongoose) and AWS S3 for storage.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install deps:

```bash
npm install
```

3. Run databases locally using Docker:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

- MongoDB is available at `localhost:27017`
- Mongo Express (UI) is available at `http://localhost:8081`

4. Run in development:

```bash
npm run dev
```

Project structure follows single-responsibility principles: controllers, services, models, routes.
