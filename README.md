# 🛒 Amazon Clone

A full-stack Amazon-inspired e-commerce application built using **Spring Boot**, **React.js**, and **PostgreSQL**. The application provides a seamless online shopping experience with secure authentication, product management, shopping cart functionality, and AWS S3 integration for media storage.

---

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected APIs

### Product Management
- Browse Products
- View Product Details
- Search Products
- Product Categories
- Inventory Management

### Shopping Cart
- Add Products to Cart
- Update Product Quantity
- Remove Products from Cart
- View Cart Summary

### Media Upload
- Upload Product Images
- Upload Product Videos
- AWS S3 Storage Integration

### Backend Features
- RESTful APIs
- Exception Handling
- DTO Pattern
- Layered Architecture
- Spring Data JPA
- Hibernate ORM

---

# 🛠️ Tech Stack

## Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven

## Frontend
- React.js
- React Router
- Axios
- Context API
- CSS

## Database
- PostgreSQL

## Cloud
- AWS S3

## Version Control
- Git
- GitHub

---

# 📂 Project Structure

```
amazon-clone/
│
├── src/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── exception/
│   └── config/
│
├── amazon-clone-frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── styles/
│
└── README.md
```

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/Nagarajudivya/AmazonClone.git
```

---

## Backend Setup

Navigate to backend directory.

```bash
cd amazon
```

Create the following file:

```
src/main/resources/application.properties
```

Copy the contents from:

```
application.properties.example
```

Update the following values:

- Database Username
- Database Password
- JWT Secret
- AWS Access Key
- AWS Secret Key
- AWS Bucket Name

Run the backend:

```bash
mvn spring-boot:run
```

---

## Frontend Setup

Navigate to frontend folder.

```bash
cd amazon-clone-frontend
```

Install dependencies.

```bash
npm install
```

Start the application.

```bash
npm run dev
```

---

# 🗄️ Database

- PostgreSQL
- Spring Data JPA
- Hibernate ORM

---

# 🔐 Authentication

- JWT Based Authentication
- Secure REST APIs
- Password Encryption

---

# ☁️ AWS Integration

- Product Image Upload
- Product Video Upload
- Amazon S3 Bucket Storage

---


# 🔮 Future Enhancements

- Wishlist
- Order Management
- Payment Gateway Integration
- User Profile
- Admin Dashboard
- Product Reviews
- Ratings
- Order History
- Email Notifications

---

# 👨‍💻 Author

**Divya Nagaraju**

- GitHub: https://github.com/Nagarajudivya
- LinkedIn: https://www.linkedin.com/in/nagaraju-divya-642310282/

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
