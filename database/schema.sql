-- ============================================================
-- CampusGig Database Schema
-- Derived from: user-service, gig-service, payment-service, chat-service
-- Database: PostgreSQL 15
-- ============================================================

-- TABLE 1: users
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(255) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: gigs
CREATE TABLE IF NOT EXISTS gigs (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    freelancer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_image     VARCHAR(500)
);

-- TABLE 3: orders
CREATE TABLE IF NOT EXISTS orders (
    id                    SERIAL PRIMARY KEY,
    gig_id                INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    client_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount                DECIMAL(10,2) NOT NULL,
    razorpay_order_id     VARCHAR(255) NOT NULL UNIQUE,
    razorpay_payment_id   VARCHAR(255),
    status                VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- TABLE 4: wallets
CREATE TABLE IF NOT EXISTS wallets (
    user_id   INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance   DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- TABLE 5: withdrawal_requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id        SERIAL PRIMARY KEY,
    user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount    DECIMAL(10,2) NOT NULL,
    status    VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- TABLE 6: messages
CREATE TABLE IF NOT EXISTS messages (
    id            SERIAL PRIMARY KEY,
    chat_room_id  VARCHAR(255) NOT NULL,
    sender_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text          TEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
