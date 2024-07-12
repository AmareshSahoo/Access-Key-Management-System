export default () => ({
  kafka: {
    broker: process.env.KAFKA_BROKER,
    consumerGroupId: process.env.KAFKA_CONSUMER_ID || 'web3-token-group'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  api: {
    coinGeckoApi: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/coins/bitcoin',
  }
});