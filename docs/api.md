# BuildKiwi API Documentation

## Base URL

```txt
http://localhost:3000
```

---

# Authentication

## Register

### POST /auth/register

Request:

```json
{
  "username": "adi",
  "email": "adi@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "user": {}
}
```

---

## Login

### POST /auth/login

Request:

```json
{
  "email": "adi@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "user": {},
  "token": "jwt-token"
}
```

---

## Current User

### GET /auth/me

Headers:

```txt
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "user": {}
}
```

---

# Users

## Get User Profile

### GET /users/:id

Response:

```json
{
  "success": true,
  "user": {}
}
```

---

## Get User Projects

### GET /users/:id/projects

Response:

```json
{
  "success": true,
  "data": []
}
```

---

# Projects

## Create Project

### POST /api/projects

Headers:

```txt
Authorization: Bearer <token>
```

Request:

```json
{
  "title": "BuildKiwi",
  "description": "Builder-first platform",
  "tags": []
}
```

Response:

```json
{
  "success": true,
  "data": {}
}
```

---

## Get Projects

### GET /api/projects?page=1&limit=10

Response:

```json
{
  "success": true,
  "data": []
}
```

---

# Feed

## Get Feed

### GET /feed?page=1&limit=10

Response:

```json
{
  "success": true,
  "data": []
}
```

---

# Comments

## Create Comment

### POST /api/projects/:id/comments

Headers:

```txt
Authorization: Bearer <token>
```

Request:

```json
{
  "content": "This project looks awesome!"
}
```

Response:

```json
{
  "success": true,
  "data": {}
}
```

---

## Get Comments

### GET /api/projects/:id/comments

Response:

```json
{
  "success": true,
  "data": []
}
```

---

# Likes

## Like Project

### POST /api/projects/:id/like

Headers:

```txt
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true
}
```

---

## Unlike Project

### DELETE /api/projects/:id/like

Headers:

```txt
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true
}
```

---

## Get Likes Count

### GET /api/projects/:id/likes

Response:

```json
{
  "success": true,
  "count": 0
}
```

---

# Search

## Search Projects

### GET /search?q=react

Response:

```json
{
  "success": true,
  "query": "react",
  "count": 0,
  "data": []
}
```

---

# Health Checks

## Health

### GET /health

Response:

```txt
Working fine
```

---

# Security

Current protections:

* JWT Authentication
* Helmet
* HPP
* Compression
* Rate Limiting

---

# Future Work

* Redis Caching
* BullMQ Queues
* File Uploads (S3 / R2)
* API Versioning
* Swagger/OpenAPI
* Docker Support
* CI/CD
* Observability

```
```
