
# Access Key Management and Token Information Microservices

## Introduction
This repository contains two microservices developed using NestJS for managing access keys and providing token information based on those keys. The microservices use Kafka for event streaming and MongoDB for data storage.

## Technologies Used
- NestJS
- MongoDB
- Kafka
- Docker
- Jest

## Microservice 1: Access Key Management Service

### Features
- **Key Generation:** Generates access keys with configurable rate limits and expiration times.
- **Admin Commands:** Allows administrators to create, update, delete, and list access keys.
- **User Queries:** Enables users to fetch details of their access plan using their key.
- **Event Streaming:** Uses Kafka for asynchronous communication between microservices.
- **Rate Limiting:** Implements rate limiting using rate-limiter-flexible.
- **No Authentication:** Designed assuming external authentication (e.g., handled by a gateway).

### Endpoints
- **POST /keys:** Create a new access key.
- **GET /keys:** List all access keys.
- **GET /keys/:keyValue:** Retrieve details of a specific access key.
- **PUT /keys/:keyValue:** Update an access key.
- **DELETE /keys/:keyValue:** Delete an access key.

### Environment Variables
- `NODE_ENV=development`
- `SERVER_PORT=3000`
- `MONGODB_URI=mongodb://localhost:27017/access-key-management?retryWrites=true&w=majority`
- `KAFKA_BROKER=localhost:9092`
- `AUTH_JWT_SECRET=my_secret`

### Running Microservice 1
```bash
docker-compose up access-key-management-ms
```

## Microservice 2: Web3 Token Information Service

### Features
- **Token Information Retrieval:** Provides token information based on valid access keys.
- **Rate Limit Enforcement:** Enforces rate limits defined in access keys.
- **Key Validation:** Validates if the access key is valid and not expired.
- **Logging:** Logs each request for token information, including key used and outcome.
- **Event Streaming:** Listens to Kafka events from Microservice 1 for key-related updates.

### Endpoints
- **GET /tokens/:keyValue:** Fetch token information for a given access key.

### Environment Variables
- `NODE_ENV=development`
- `KAFKA_BROKER=localhost:9092`
- `KAFKA_CONSUMER_ID=web3-token-group`
- `MONGODB_URI=mongodb://localhost:27018/token-management?retryWrites=true&w=majority`
- `SECRET_KEY=my_secret`
- `COINGECKO_API_URL=https://api.coingecko.com/api/v3/coins/bitcoin`

### Running Microservice 2
```bash
docker-compose up token-information-ms
```

## Integration with Docker Compose
Ensure Docker and Docker Compose are installed. Use the provided `docker-compose.yml` file to orchestrate both microservices along with Kafka and MongoDB instances.

```bash
docker-compose up
```
This command starts all defined services (Zookeeper, Kafka, MongoDB instances for each microservice, Access Key Management Service, and Token Information Service).

## Testing
Unit and integration tests are included using Jest. To run tests:

```bash
docker-compose run access-key-management-ms npm run test
docker-compose run token-information-ms npm run test
```

## Contributing
Feel free to contribute by forking this repository and submitting pull requests. Bug fixes, improvements, and suggestions are welcome!

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

You can copy and paste this formatted README file into your repository.
