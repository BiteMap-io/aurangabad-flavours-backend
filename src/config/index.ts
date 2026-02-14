const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aurangabad',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  s3Bucket: process.env.S3_BUCKET || '',
  adminCredentials: {
    email: process.env.ADMIN_EMAIL || 'admin@aurangabadflavours.com',
    password: process.env.ADMIN_PASSWORD || 'adminPassword123!',
  },
};

export default config;
