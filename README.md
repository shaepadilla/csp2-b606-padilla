# Capstone 2 - E-commerce API

Backend API for a simple e-commerce application. It supports user registration/login, JWT authentication, admin-only product management, product browsing/search, cart management, checkout, and order retrieval.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- CORS

## Requirements Covered

- User model, product model, cart model, and order model
- User registration and login
- JWT authentication middleware
- Admin authorization middleware
- Admin product CRUD and archive/activate controls
- Public active product listing and product search
- User cart retrieval, add-to-cart, and quantity update workflows
- Checkout from cart into orders
- User order history and admin all-orders endpoint
- Postman collection for API testing

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Create a `.env` file in the project root:

```env
MONGODB_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
PORT=4000
```

### 3. Run the API

```bash
npm start
```

The API will run at:

```text
http://localhost:4000/b6
```

## Default Test Accounts

| Account Type | Email | Password |
| --- | --- | --- |
| Regular User | jamesDoe@mail.com | sample123 |
| Admin | admin@mail.com | admin123 |

> If these accounts are not yet in your database, create them through the register endpoint, then promote the admin using the set-as-admin route or directly through MongoDB.

## Authentication

Protected routes require this header:

```text
Authorization: Bearer <access_token>
```

Login returns an `access` token. In Postman, save it as either `userToken` or `adminToken` depending on the account used.

## API Endpoints

Base URL:

```text
{{baseUrl}}/b6
```

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/users/register` | Public | Register a new user |
| POST | `/users/login` | Public | Login and receive JWT access token |
| GET | `/users/details` | User | Get logged-in user profile |
| GET | `/users/auth/me` | User | Get logged-in user profile alias |
| PATCH | `/users/update-password` | User | Update password |
| PATCH | `/users/update-profile` | User | Update profile |
| PATCH | `/users/:id/set-as-admin` | Admin | Promote a user as admin |

### Products

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/products` | Admin | Create product |
| GET | `/products/all` | Admin | Get all products |
| GET | `/products/active` | Public | Get active products |
| GET | `/products/seasonal` | Public | Get seasonal products |
| GET | `/products/category/:category` | Public | Get active products by category |
| GET | `/products/:productId` | Public | Get product by ID |
| PATCH | `/products/:productId/update` | Admin | Update product |
| PATCH | `/products/:productId/archive` | Admin | Archive/deactivate product |
| PATCH | `/products/:productId/activate` | Admin | Activate product |
| POST | `/products/search-by-name` | Public | Search product by exact name |
| POST | `/products/search-by-price` | Public | Search products by price range |

### Cart

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/cart/get-cart` | User | Retrieve logged-in user's cart |
| POST | `/cart/add-to-cart` | User | Add item to cart |
| PATCH | `/cart/update-cart-quantity` | User | Update quantity using body productId |
| GET | `/cart` | User | REST alias: retrieve cart |
| POST | `/cart/items` | User | REST alias: add item |
| PATCH | `/cart/items/:productId` | User | REST alias: update quantity |
| DELETE | `/cart/items/:productId` | User | Remove item from cart |
| DELETE | `/cart` | User | Clear cart |

### Orders

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/orders/checkout` | User | Checkout cart and create order |
| GET | `/orders/my-orders` | User | Retrieve logged-in user's orders |
| GET | `/orders/all-orders` | Admin | Retrieve all orders |
| GET | `/orders/:orderId` | User/Admin | Retrieve single order details |
| PATCH | `/orders/:orderId/status` | Admin | Update order status |
| PUT | `/orders/:orderId/status` | Admin | Update order status alias |

## Postman Testing

Import this file into Postman:

```text
Capstone2_Ecommerce_API.postman_collection.json
```

Recommended flow:

1. Register a regular user.
2. Login as regular user and save `access` as `userToken`.
3. Login as admin and save `access` as `adminToken`.
4. Create a product as admin.
5. Get active products and copy a `productId`.
6. Add product to cart as user.
7. Retrieve cart.
8. Update cart quantity.
9. Checkout.
10. Retrieve my orders.
11. Retrieve all orders as admin.

## Notes for Evaluators

- Admin-only routes use both `verify` and `verifyAdmin` middleware.
- User-only cart/profile routes block admin accounts using `verifyUserAccess`.
- Product routes place static routes before `/:productId` to prevent route conflicts.
- The order status route uses `/:orderId/status` so `orderId` is correctly available in `req.params`.
