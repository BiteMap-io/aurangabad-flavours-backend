# Aurangabad Flavours — Backend (TS)

Basic TypeScript Express backend scaffold using MongoDB (Mongoose) and AWS S3 for storage.

### Storage (S3 / Google Cloud)
- `S3_ENDPOINT`: Storage provider endpoint (e.g., `https://storage.googleapis.com`)
- `S3_REGION`: Storage region (use `auto` for GCS)
- `S3_ACCESS_KEY_ID`: Your HMAC Access Key
- `S3_SECRET_ACCESS_KEY`: Your HMAC Secret Key
- `S3_BUCKET`: The name of your bucket

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
