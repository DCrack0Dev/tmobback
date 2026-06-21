# TechNow Mobile API Documentation

Base URL: `/api`

---

## Authentication

### Register
- `POST /auth/register`
- **Auth required: No**
- Request body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123",
    "phone": "1234567890"
  }
  ```
- Response:
  ```json
  {
    "token": "...",
    "user": { "id": 1, "name": "John Doe", "email": "...", "phone": "...", "role": "customer" }
  }
  ```

### Login
- `POST /auth/login`
- **Auth required: No**
- Request body:
  ```json
  {
    "email": "john@example.com",
    "password": "secret123"
  }
  ```
- Response:
  ```json
  {
    "token": "...",
    "user": { ... }
  }
  ```

### Get Current User
- `GET /auth/me`
- **Auth required: Yes**
- Response:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
  ```

---

## Products

### Get Products
- `GET /products`
- **Auth required: No**
- Query params:
  - `search`: Search by name or brand
  - `brand`: Filter by brand
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `sort`: Sort by `price_asc`, `price_desc`, `newest`
  - `page`: Page number
  - `limit`: Items per page
- Response:
  ```json
  {
    "products": [ ... ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
  ```

### Get Product
- `GET /products/:id`
- **Auth required: No**
- Response:
  ```json
  {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "brand": "Apple",
    "description": "...",
    "price": 1199.99,
    "stock": 50,
    "images": [ "https://..." ],
    "specifications": { "RAM": "8GB", ... },
    "is_featured": true,
    "average_rating": 4.5,
    "review_count": 10
  }
  ```

### Create Product
- `POST /products`
- **Auth required: Yes (Admin only)**
- Request body:
  ```json
  {
    "name": "Product Name",
    "brand": "Brand",
    "description": "...",
    "price": 999.99,
    "stock": 10,
    "specifications": {},
    "is_featured": false
  }
  ```

### Update Product
- `PUT /products/:id`
- **Auth required: Yes (Admin only)**
- Request body: Same as create product

### Delete Product
- `DELETE /products/:id`
- **Auth required: Yes (Admin only)**

### Upload Product Images
- `POST /products/:id/images`
- **Auth required: Yes (Admin only)**
- Content-Type: `multipart/form-data`
- Field: `images` (multiple files)
- Response:
  ```json
  {
    "images": [ "https://...", "https://..." ]
  }
  ```

---

## Reviews

### Get Product Reviews
- `GET /products/:id/reviews`
- **Auth required: No**
- Response:
  ```json
  [
    {
      "id": 1,
      "product_id": 1,
      "user_id": 1,
      "rating": 5,
      "comment": "Great product!",
      "created_at": "..."
    }
  ]
  ```

### Create Review
- `POST /products/:id/reviews`
- **Auth required: Yes**
- Request body:
  ```json
  {
    "rating": 5,
    "comment": "Great product!"
  }
  ```

---

## Cart

### Get Cart
- `GET /cart`
- **Auth required: Yes**
- Response:
  ```json
  [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 1,
      "name": "Product Name",
      "price": 999.99,
      "images": [...]
    }
  ]
  ```

### Add to Cart
- `POST /cart`
- **Auth required: Yes**
- Request body:
  ```json
  {
    "product_id": 1,
    "quantity": 1
  }
  ```

### Update Cart Item
- `PUT /cart/:productId`
- **Auth required: Yes**
- Request body:
  ```json
  {
    "quantity": 2
  }
  ```

### Remove from Cart
- `DELETE /cart/:productId`
- **Auth required: Yes**

---

## Orders

### Create Order
- `POST /orders`
- **Auth required: Optional**
- Request body:
  ```json
  {
    "items": [
      { "product_id": 1, "quantity": 1 }
    ],
    "shipping_address": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "guest_phone": "1234567890",
    "create_account": false,
    "password": "secret123"
  }
  ```
- Response:
  ```json
  {
    "id": 1,
    "total_amount": 999.99,
    "crypto_amount": 999.99,
    "exchange_rate_used": 1.0,
    "wallet_address": "...",
    "status": "pending_payment",
    "shipping_address": { ... },
    "qr_code": "data:image/png;base64,..."
  }
  ```

### Get Orders
- `GET /orders`
- **Auth required: Yes**
- Response: Array of orders

### Get Order
- `GET /orders/:id`
- **Auth required: Optional (guest can view their order by ID)**
- Response: Order with items

### Submit Transaction Hash
- `POST /orders/:id/transaction-hash`
- **Auth required: Optional**
- Request body:
  ```json
  {
    "transaction_hash": "0x..."
  }
  ```

---

## Currency

### Get Currency Rates
- `GET /currency/rates`
- **Auth required: No**
- Response:
  ```json
  {
    "rates": {
      "USD": 1,
      "EUR": 0.92,
      "GBP": 0.79,
      "ZAR": 18.5
    },
    "last_updated": "2024-01-01T00:00:00.000Z"
  }
  ```

---

## Admin

### Get Stats
- `GET /admin/stats`
- **Auth required: Yes (Admin only)**
- Response:
  ```json
  {
    "total_orders": 100,
    "total_revenue": 9999.99,
    "pending_orders": 10,
    "total_products": 50,
    "monthly_data": [ ... ]
  }
  ```

### Get All Orders
- `GET /admin/orders`
- **Auth required: Yes (Admin only)**
- Query params: `status` (optional)
- Response: Array of orders

### Update Order Status
- `PUT /admin/orders/:id/status`
- **Auth required: Yes (Admin only)**
- Request body:
  ```json
  {
    "status": "paid"
  }
  ```

### Verify Payment
- `PUT /admin/orders/:id/verify-payment`
- **Auth required: Yes (Admin only)**

### Get Customers
- `GET /admin/customers`
- **Auth required: Yes (Admin only)**
- Response: Array of users with role=customer

### Get Customer Orders
- `GET /admin/customers/:id/orders`
- **Auth required: Yes (Admin only)**
- Response: Array of orders for the customer
