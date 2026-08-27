# InvoicePro NG API Documentation

> **Status:** Active development
>
> This document describes the currently implemented API endpoints for frontend integration. It will be updated as new endpoints, validation rules, error handling, and features are added.

# InvoicePro NG Backend

Backend API for InvoicePro NG. The API currently provides authentication, a health check, and customer management for the logged-in user.

## Current Product Scope

Implemented:

- User registration and login
- JWT authentication
- Protected current-session endpoint
- Create and view customers
- Customer isolation by authenticated user
- Persistent database storage

Not implemented yet:


- Update and delete customer endpoints
- Invoices and invoice line items
- Password reset, email verification, and user profile editing

## Run Locally

### Requirements

- Node.js
- npm

### Install and start

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default. Use `npm start` to run without Nodemon.

### Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

`JWT_SECRET` is required for creating and verifying tokens. `CLIENT_ORIGIN` can contain multiple comma-separated origins, or `*` for development.

## API Basics

Base URL:

```text
http://localhost:5000/api/v1
```

Requests with JSON bodies must include:

```http
Content-Type: application/json
```

Protected endpoints require:

```http
Authorization: Bearer <token>
```

Successful responses generally include `success: true`. Errors include `success: false` and either a `message` or an `error` object.

## Endpoints

### Health check

#### `GET /health`

Checks whether the API is running. Authentication is not required.

Example response (`200 OK`):

```json
{
	"success": true,
	"data": {
		"status": "ok",
		"uptime": 12.45
	}
}
```

### Authentication

#### `POST /auth/register`

Creates a user and returns a one-day JWT.

Request body:

```json
{
	"name": "Ada Lovelace",
	"email": "ada@example.com",
	"password": "strong-password"
}
```

All three fields are required. Example response (`201 Created`):

```json
{
	"success": true,
	"data": {
		"token": "<jwt>",
		"user": {
			"UUID": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
			"name": "Ada Lovelace",
			"email": "ada@example.com"
		}
	}
}
```


#### `POST /auth/login`

Authenticates an existing user and returns a one-day JWT.

Request body:

```json
{
	"email": "ada@example.com",
	"password": "strong-password"
}
```

Example response (`200 OK`) has the same shape as registration. Possible errors: (`401 Unauthorized`)

#### `GET /auth/me`

Protected endpoint used to confirm that a token is valid.

Example request:

```http
GET /api/v1/auth/me
Authorization: Bearer <jwt>
```

Example response (`200 OK`):

```json
{
	"success": true,
	"message": "You accessed a protected route!",
	"user": {
		"UUID": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
		"iat": 1710000000,
		"exp": 1710086400
	}
}
```

`user` is the decoded JWT payload. It contains the user ID plus the standard issued-at (`iat`) and expiration (`exp`) claims.

### Customers

All customer endpoints are protected. Customers can only be read by the user who created them.

#### `POST /customers`

Creates a customer for the authenticated user.

Request body:

```json
{
	"name": "InvoicePro Ltd",
	"email": "hello@invoicepro.example",
	"phone": "+234 567 890",
	"address": "1 Main Street",
	"city":"Ikeja",
	"state":"Lagos",
	"country":"Nigeria",
}
```

Only `name` is required. `email`, `phone`, and `address` can be added later.

Example response (`201 Created`):

```json
{
	"success": true,
	"data": {
		"UUID": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
		"userId": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
		"name": "Invoicepro Ltd",
		"email": "hello@invoicepro.example",
		"phone": "+234 567 890",
		"address": "1 Main Street",
		"city":"Ikeja",
		"state":"Lagos",
		"country":"Nigeria",
		"createdAt": "2026-08-26T12:00:00.000Z"
	}
}
```
#### `GET /customers`

Returns all customers belonging to the authenticated user.

Example response (`200 OK`):

```json
{
	"success": true,
	"count": 1,
	"data": [
		{
			"UUID": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
			"userId": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
			"name": "Invoicepro Ltd",
			"email": "hello@invoicepro.example",
			"phone": "+234 567 890",
			"address": "1 Main Street",
			"city":"Ikeja",
			"state":"Lagos",
			"country":"Nigeria",
			"createdAt": "2026-08-26T12:00:00.000Z"
		}
	]
}
```

#### `GET /customers/:id`

Returns one customer by ID. The customer must belong to the authenticated user.

Example:

```http
GET /api/v1/customers/1710000000001
Authorization: Bearer <jwt>
```

Example response (`200 OK`):

```json
{
	"success": true,
	"data": {
		"UUID": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
		"userId": "c7b12c8e-4f9a-4b1a-9b9b-1c8e4f9a4b1a",
		"name": "Invoicepro Ltd",
		"email": "hello@invoicepro.example",
		"phone": "+234 567 890",
		"address": "1 Main Street",
		"city":"Ikeja",
		"state":"Lagos",
		"country":"Nigeria",
		"createdAt": "2026-08-26T12:00:00.000Z"
	}
}
```

## Authentication Errors

Protected endpoints return:

```json
{
	"success": false,
	"message": "Not authorized, no token"
}
```

If a token is malformed, expired, or signed with the wrong secret, the message is `Not authorized, token failed` and the status is `401 Unauthorized`.


## Project Structure

```text
src/
	app.js                 Express app and middleware
	server.js              HTTP server startup
	config/env.js          Environment configuration
	routes/                API route definitions
	controllers/           Request and response handling
	services/              Business logic and temporary storage
	middlewares/           Authentication middleware
	utils/jwt.js           JWT creation
```