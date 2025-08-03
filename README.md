# Farms Connect

A platform to connect farmers directly with consumers and government agencies for better prices and fresher produce.

## Features

- User authentication (Login/Register)
- Product listing and management (Add/Edit/Delete)
- Interactive UI with search, dark mode, and favorites
- Order placement system
- Profile management

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

1.  Clone the repository.
2.  Run `npm install`.
3.  Create a `.env` file with your MongoDB connection string and JWT secret.
4.  Run `npm run dev` to start the development server.

## Project Structure

```
farmers-marketplace/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── models/
│   ├── User.js
│   └── Product.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Add new product (Farmer only)
- PUT `/api/products/:id` - Update product (Farmer only)
- DELETE `/api/products/:id` - Delete product (Farmer only)

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 