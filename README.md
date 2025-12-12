# 🎓 CampusGig - College Freelance Marketplace

CampusGig is a closed-loop freelance marketplace designed specifically for college campuses. It solves the "trust gap" in student freelancing by allowing students to offer services—such as assignment help, design, and tutoring—specifically to peers within their trusted college ecosystem.

## 🚀 Core Philosophy
- Hyper-Local: Focused on building trust within a specific college community
- Minimalist: Features direct payments (no complex escrow), instant chat, and simple listings.
- Microservices: Built on a scalable, decoupled architecture for Auth, Gigs, Payments, and Chat.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), TailwindCSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Relational Model) |
| **Real-Time** | Socket.io |
| **Payments** | Razorpay (Direct Integration) |
| **DevOps** | Docker, Docker Compose |
| **Gateway** | Express HTTP Proxy |

---

## 🏗️ System Architecture

The system uses a **Microservices Architecture** where all client requests are routed through a central **API Gateway**.

| Service | Internal Port | Docker Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **API Gateway** | 8000 | `8000` | Central Routing, Basic Auth Checks |
| **User Service** | 5001 | `5001` | Authentication, User Profiles |
| **Gig Service** | 5002 | `5002` | Gig Listings, Search, Reviews |
| **Payment Service** | 5003 | `5003` | Razorpay Order Management |
| **Chat Service** | 5004 | `5004` | Real-Time Messaging (Socket.io) |
| **PostgreSQL** | 5432 | `5432` | Shared Relational Database |

---

### API Gateway Routes
- /api/auth & /api/users → User Service
- /api/gigs → Gig Service
- /api/orders → Payment Service
- /api/chats & /api/messages → Chat Service

## 📂 Directory Structure
The project is organized as a monorepo containing all services and the client.
```
/campus-gig
├── /api-gateway        # Express Proxy
├── /user-service       # Auth & Profile Logic
├── /gig-service        # Marketplace Logic
├── /payment-service    # Razorpay Integration
├── /chat-service       # Socket.io Server
├── /client             # React Frontend
└── docker-compose.yml  # Orchestration
```

## ⚡ Getting Started

### Prerequisites
- Docker Desktop installed and running.
- Node.js (v18+) if running services individually outside Docker.

### Installation
1. 📥 Clone the Repository

```bash
git clone https://github.com/yourusername/CampusGig.git
cd CampusGig
```

2. Environment Variables
Create a .env file in the root (or within specific service folders as needed). Note: docker-compose.yml handles most environment injection for local dev.
### 🔐 Required Secrets

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
JWT_KEY=your_secret_key
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

3. Run with Docker Compose: This command will spin up the Postgres database, all 4 backend services, the API Gateway, and the Frontend.
```bash
docker-compose up --build
```

4. Access the Application:
- Frontend: http://localhost:5173
- API Gateway: http://localhost:8000

## 💳 Payment Flow (MVP)

CampusGig uses a **Direct Payment model** to simplify the MVP.

### 🔄 How It Works

1. Buyer clicks **"Order Now"**.
2. Payment Service creates a **Razorpay Order ID**.
3. Buyer completes payment through the **Razorpay Checkout Modal**.
4. On success, the order status updates to **success** in the database.

## 📝 Features Checklist

- [ ] **User Auth:** Register/Login with college info.
- [ ] **Gig Creation:** Create, edit, and delete service listings.
- [ ] **Search:** Filter gigs by category and price.
- [ ] **Chat:** Real-time messaging between buyer and seller.
- [ ] **Orders:** Track order status (Pending/Completed).
- [ ] **Reviews:** Star ratings for completed gigs.

## 🛡️ Security

- **JWT:** Access tokens are stored in HttpOnly cookies.
- **CORS:** Configured to allow requests strictly from the frontend origin.
- **Environment:** Sensitive keys are never committed to version control.
