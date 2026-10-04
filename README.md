# SmartDoc AI

SmartDoc AI is a starter workspace for document ingestion, processing, and conversational search. It includes a React frontend, Java Spring Boot API and worker services, Node.js Lambda handler skeletons, and an AWS SAM infrastructure template.

## Repository layout

- `infra/` — AWS SAM template and stage parameters.
- `backend/api-service/` — Spring Boot REST API starter.
- `backend/worker-service/` — Java worker starter for SQS and AI processing.
- `backend/lambda-functions/` — S3 ingestion and DynamoDB stream handler skeletons.
- `frontend/` — React/Vite document workspace UI.
- `.github/workflows/` — CI checks and deployment workflow.

## Prerequisites

- Java 21 and Maven 3.9+
- Node.js 22 and npm
- Docker with Docker Compose
- AWS SAM CLI for deploying the infrastructure

## Run locally

From the repository root, start the services with `docker compose up --build`. The frontend is available at `http://localhost:3000`, the API health endpoint at `http://localhost:8080/api/health`, and LocalStack at `http://localhost:4566`.

For frontend development with hot reload, run `npm install` and `npm run dev` in `frontend/` (Vite serves on port 5173). Set `VITE_API_BASE_URL` to the API base URL when connecting to an API instance.

## Deploy AWS infrastructure

Review the values in `infra/parameters/dev.json` or `infra/parameters/prod.json`, then run `sam build --template-file infra/template.yaml` and `sam deploy --guided` from the repository root. Lambda code locations in the SAM template are relative to the template directory. Configure AWS credentials and select the intended stage/account before deploying.

The GitHub deploy workflow uses OIDC. Configure the `AWS_DEPLOY_ROLE_ARN` secret and optional `AWS_REGION` variable in the repository/environment settings.

## Starter implementation notes

The Lambda handlers currently validate and transform event records but leave DynamoDB, SQS, and Redis operations as TODOs. The Java worker's document-processing and model invocation are also extension points. The API currently exposes a basic health endpoint; Cognito authorization, document CRUD, presigned upload URLs, chat endpoints, and production persistence still need implementation. Do not deploy this starter as a production system without adding authentication, least-privilege policies, encryption and retention decisions, observability, and integration tests.
