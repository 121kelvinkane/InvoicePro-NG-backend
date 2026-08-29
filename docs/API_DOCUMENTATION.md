# InvoicePro NG API Documentation

**Base URL:** `http://localhost:5000/api/v1`
**Auth:** `Authorization: Bearer <token>`

---

## 1. Authentication

### `POST /auth/register`
```json
{"name":"John","email":"john@test.com","password":"123"}
```

### `POST /auth/login`
```json
{"email":"john@test.com","password":"123"}
```

### `GET /auth/me`
Returns current user profile.

---

## 2. Customers

### `POST /customers`
```json
{"name":"Acme","email":"acme@test.com","phone":"+234"}
```

### `GET /customers`
Returns all user customers.

---

## 3. Invoices

### `POST /invoices`
Backend calculates totals automatically.
```json
{"customerId":"uuid","items":[{"description":"Design","quantity":2,"unitPrice":500}],"tax":7.5,"discount":50}
```

### `GET /invoices`
Returns all user invoices.

### `GET /invoices/:id`
Returns single invoice.

### `PUT /invoices/:id/status`
Update status (draft, sent, paid).

### `DELETE /invoices/:id`
Deletes invoice.

---

## Error Format
```json
{"success":false,"message":"Error description"}
```