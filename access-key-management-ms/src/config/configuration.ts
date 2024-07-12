export default () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  serverPort: parseInt(process.env.SERVER_PORT!, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  mongoUri: process.env.MONGODB_URI,
  kafkaBroker: process.env.KAFKA_BROKER,
  kafkaClientId: process.env.KAFKA_CLIENTID || 'access-key-management-service',
  jwtSecret: process.env.AUTH_JWT_SECRET || 'my_secret',
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '24h',
});
