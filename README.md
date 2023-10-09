# Token Generator Service

## Objective
The main goal is to create a service that powers a token generator system using NodeJs, Redis and Docker.

## Description
You have been asked to create a service that will manage the token generation and redemption of our new application.

The service is required to expose 3 endpoints, one to create the tokens, a second to check the status of a token and a third one to redeem a token.

For this exercise, tokens can be just a random non-sequential string. Tokens expire after 10 days of creation.

## Endpoints

### POST /tokens/generate?tokens=100
#### 200 OK
```json
{
  "created": "{timestamp}",
  "tokens": ["token1", "token2"],
}
```

### GET /tokens/check/{token}
#### 200 OK
```json
{
  "status": "[available | redeemed | expired]"
}
```

### PUT /tokens/redeem/{token}
#### 200 OK
```json
{
  "result": "ok"
}
```

#### 410 Gone
```json
{
  "result": "redeemed | expired]"
}
```

## Get Started

- Simple run `npm run start:local` to boot both the app and redis server locally, using docker compose.  The app will be exposed on port 3000
- To check app is running correctly: `curl http://localhost:3000/healthcheck/ping`

## Future Improvements
- Component / feature tests: Would ideally have another suite of tests that check the behaviour of the API, ensuring each endpoint is available and returning the correct data. Left this for now as can be lengthy to setup
- Logging: If this were a real application to be deployed, this would ideally have logging per request to allow for easy tracing of requests and debugging of errors
- Validate requests: Middleware component to validate request values against schema
