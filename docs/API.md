# Aurangabad Flavours API Documentation

Welcome to the API documentation for the Aurangabad Flavours Backend. This API provides resources for managing restaurants, dishes, food trails, articles, and events in the Aurangabad region.

## Base URL

`http://localhost:4000/v1`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most administrative tasks (POST, PUT, DELETE) require a Bearer token.

### How to Authenticate

1.  **Signup**: Create a user using `/auth/signup`.
2.  **Login**: Authenticate with `/auth/login` to receive a token.
3.  **Use Token**: Include the token in the `Authorization` header for protected endpoints:
    `Authorization: Bearer <your_token>`

---

## Auth Endpoints

### Register User

`POST /auth/signup`

Registers a new user (Customer by default).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "userType": "customer"
}
```

_Note: `userType` can be `customer`, `admin`, or `restaurant_owner`._

**Response (201):**

```json
{
  "message": "User created successfully",
  "token": "eyJhbG..."
}
```

### Login User

`POST /auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "customer"
  }
}
```

---

## User Endpoints

### Create User (Admin Only)

`POST /users`

**Request Body:** Same as Signup.
**Response (201):** User created.

### Get User by ID

`GET /users/:id`

Returns details of a specific user. Requires authentication.

---

## Restaurant Endpoints

### Get All Restaurants (Public)

`GET /restaurants`

**Response (200):** Array of restaurants.

### Get Restaurant by ID (Public)

`GET /restaurants/:id`

**Response (200):** Detailed restaurant object.

### Create Restaurant (Admin Only)

`POST /restaurants`

Uses `multipart/form-data` for image uploads.

**Fields:**

- `name`: string (required)
- `estabilishmentType`: string (required)
- `priceRange`: string (required)
- `description`: string (required)
- `area`: string (required)
- `image`: file (required)
- `location[coordinates]`: array of numbers (longitude, latitude)

### Update Restaurant (Admin Only)

`PUT /restaurants/:id`

**Fields:** Same as POST (all optional).

### Delete Restaurant (Admin Only)

`DELETE /restaurants/:id`

---

## Dish Endpoints

### Get All Dishes (Public)

`GET /dishes`

### Get Dish by ID (Public)

`GET /dishes/:id`

### Create Dish (Admin Only)

`POST /dishes`

**Request Body:**

```json
{
  "name": "Naan Khalia",
  "image": "url_to_image",
  "category": "Main Course",
  "restaurantId": "restaurant_id_here"
}
```

### Update/Delete Dish (Admin Only)

`PUT /dishes/:id` | `DELETE /dishes/:id`

---

## Article Endpoints (Blog/News)

### Get All Articles (Public)

`GET /articles`

### Create Article (Admin Only)

`POST /articles`

**Request Body:**

```json
{
  "title": "Top 10 Street Foods",
  "slug": "top-10-street-foods",
  "content": "Full article content...",
  "author": "user_id_here",
  "excerpt": "Brief summary",
  "image": "url_to_image",
  "publishedDate": "2026-02-14T10:00:00Z",
  "readTime": "5 mins",
  "featured": true
}
```

---

## Event Endpoints

### Get All Events

`GET /events` (Requires Auth)

### Create Event (Admin Only)

`POST /events`

**Request Body:**

```json
{
  "name": "Food Festival",
  "description": "Annual food fest",
  "date": "2026-03-01T18:00:00Z",
  "location": "Aurangabad Stadium",
  "image": "url",
  "organizer": "Aurangabad Flavours",
  "price": "500",
  "capacity": 200
}
```

---

## Food Trail Endpoints

### Get All Food Trails

`GET /food-trails` (Requires Auth)

### Create Food Trail (Admin Only)

`POST /food-trails`

**Request Body:**

```json
{
  "name": "Old City Spice Trail",
  "description": "Explore the spices of the old city",
  "icon": "map-marker",
  "color": "#FF5733",
  "estimatedTime": "3 hours",
  "restaurantsId": ["id1", "id2"],
  "highlights": ["Tara Pan Center", "Gayatri Chaat"]
}
```

---

## Error Codes

| Status Code | Description                             |
| :---------- | :-------------------------------------- |
| 400         | Bad Request (Invalid input)             |
| 401         | Unauthorized (Missing or invalid token) |
| 403         | Forbidden (Insufficient permissions)    |
| 404         | Not Found (Resource doesn't exist)      |
| 500         | Internal Server Error                   |
