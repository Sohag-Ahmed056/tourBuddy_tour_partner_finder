
````markdown
# Travel Buddy Finder - Backend

Backend server for the **Travel Buddy Finder** application built with **Express.js**, **Node.js**, and **MongoDB/PostgreSQL** (or your DB). This server handles authentication, travel plans, user profiles, reviews, join requests, and payment subscriptions.

---

## **Features**

- **Authentication & User Management**  
  - User registration (Tourist/Admin)  
  - Login, logout, and password change  
  - Role-based access control (TOURIST, ADMIN)  

- **Tourist & User Management**  
  - Create, read, update, delete users  
  - Fetch own profile or other users’ profiles  

- **Travel Plans**  
  - Create, update, delete, and get travel plans  
  - Search and filter travel plans  

- **Join Requests**  
  - Send, respond, cancel, and list join requests  

- **Reviews**  
  - Create reviews for other users  

- **Payments / Subscriptions**  
  - Stripe integration for subscriptions  
  - Webhook for payment events  

- **Middleware & Utilities**  
  - JWT-based authentication  
  - Role-based authorization  
  - Global error handling  
  - File uploads for profile images  

---

## **Tech Stack**

- **Backend Framework:** Express.js  
- **Language:** Node.js / TypeScript (if applicable)  
- **Database:** MongoDB / PostgreSQL (via Prisma or Mongoose)  
- **Authentication:** JWT + Role-based access  
- **File Upload:** Multer + Cloudinary (or local)  
- **Payment Gateway:** Stripe  
- **Validation:** Zod / Custom validators  

---

## **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/travel-buddy-backend.git
cd travel-buddy-backend
````

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Create a `.env` file**

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

The server will run at `http://localhost:5000` by default.

---

## **API Endpoints**

### **Authentication**

| Method | Endpoint                       | Role    | Description     |
| ------ | ------------------------------ | ------- | --------------- |
| POST   | `/api/v1/auth/login`           | PUBLIC  | User login      |
| POST   | `/api/v1/auth/change-password` | TOURIST | Change password |

### **Users**

| Method | Endpoint                      | Role    | Description             |
| ------ | ----------------------------- | ------- | ----------------------- |
| POST   | `/api/v1/user/create-tourist` | PUBLIC  | Register tourist        |
| POST   | `/api/v1/user/create-admin`   | ADMIN   | Create admin user       |
| DELETE | `/api/v1/user/delete`         | ADMIN   | Delete a user           |
| GET    | `/api/v1/user/all`            | ADMIN   | Get all users           |
| GET    | `/api/v1/user/my-profile`     | TOURIST | Get own profile         |
| POST   | `/api/v1/user/update-user`    | TOURIST | Update own profile      |
| GET    | `/api/v1/user/get-user/:id`   | TOURIST | Get single user profile |

### **Tourists**

| Method | Endpoint                     | Role  | Description       |
| ------ | ---------------------------- | ----- | ----------------- |
| GET    | `/api/v1/tourist/get-all`    | ADMIN | Get all tourists  |
| GET    | `/api/v1/tourist/get/:id`    | ADMIN | Get tourist by ID |
| DELETE | `/api/v1/tourist/delete/:id` | ADMIN | Delete tourist    |

### **Travel Plans**

| Method | Endpoint                                | Role    | Description            |
| ------ | --------------------------------------- | ------- | ---------------------- |
| POST   | `/api/v1/travel/create-travel-plan`     | TOURIST | Create travel plan     |
| GET    | `/api/v1/travel/get-all-travel-plans`   | PUBLIC  | Get all travel plans   |
| GET    | `/api/v1/travel/get-single-tour/:id`    | PUBLIC  | Get single travel plan |
| PUT    | `/api/v1/travel/update-travel-plan/:id` | TOURIST | Update travel plan     |
| DELETE | `/api/v1/travel/delete-travel-plan/:id` | TOURIST | Delete travel plan     |

### **Join Requests**

| Method | Endpoint                               | Role    | Description                 |
| ------ | -------------------------------------- | ------- | --------------------------- |
| POST   | `/api/v1/join/join-request`            | TOURIST | Send join request           |
| GET    | `/api/v1/join/join-request/sent`       | TOURIST | List sent join requests     |
| GET    | `/api/v1/join/join-request/received`   | TOURIST | List received join requests |
| POST   | `/api/v1/join/join-request/respond`    | TOURIST | Respond to join request     |
| DELETE | `/api/v1/join/join-request/:id/cancel` | TOURIST | Cancel join request         |

### **Reviews**

| Method | Endpoint                       | Role    | Description   |
| ------ | ------------------------------ | ------- | ------------- |
| POST   | `/api/v1/review/create-review` | TOURIST | Create review |

### **Payments**

| Method | Endpoint                    | Role    | Description                 |
| ------ | --------------------------- | ------- | --------------------------- |
| POST   | `/api/v1/payment/subscribe` | TOURIST | Create subscription session |
| POST   | `/webhook`                  | PUBLIC  | Stripe webhook handler      |

---

## **Project Structure**

```
├─ /app
│   ├─ /modules
│   │   ├─ /auth
│   │   ├─ /user
│   │   ├─ /tourist
│   │   ├─ /travel
│   │   ├─ /join
│   │   ├─ /review
│   │   └─ /payment
│   ├─ /middlewares
│   ├─ /helper
│   └─ /routes
├─ server.js (or index.js)
└─ .env
```

---

## **Deployment**

* Ensure environment variables are set correctly on your hosting platform (Render, Heroku, or VPS).
* Run `npm start` for production.
* Use `PM2` or `Docker` for process management in production.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to branch (`git push origin feature/my-feature`).
5. Open a pull request.

---

## **License**

MIT License

---

## **Contact**

* Project Owner: **Your Name**
* Email: **[your.email@example.com](mailto:your.email@example.com)**
* GitHub: [https://github.com/yourusername](https://github.com/yourusername)

```

