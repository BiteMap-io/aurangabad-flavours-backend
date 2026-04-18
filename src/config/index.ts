const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aurangabad',
  s3: {
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    endpoint: process.env.S3_ENDPOINT || '',
    bucket: process.env.S3_BUCKET || '',
  },
  adminCredentials: {
    email: process.env.ADMIN_EMAIL || 'admin@aurangabadflavours.com',
    password: process.env.ADMIN_PASSWORD || 'adminPassword123!',
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_change_me',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
};

export default config;
