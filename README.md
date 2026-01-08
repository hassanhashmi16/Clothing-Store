# Elegance - Modern Clothing Store

A premium e-commerce application built with Next.js 16 and MongoDB, featuring a "Quiet Luxury" aesthetic.

## Features

- **Modern UI/UX**: Minimalist design with Tailwind CSS v4.
- **Product Catalog**: Categories (Men, Women) and collections.
- **Search**: Real-time product search with overlay.
- **Cart**: Functional shopping cart with state management.
- **Auth**: Google OAuth integration via NextAuth.js.
- **Admin**: Dashboard for product management.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB & Mongoose
- **Auth**: NextAuth.js

## Getting Started

1.  **Clone and Install**
    ```bash
    git clone <repository-url>
    cd store
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Project Structure

```bash
store/
├── app/
│   ├── (shop)/           # Shop routes
│   ├── admin/            # Dashboard
│   ├── api/              # API endpoints
│   ├── components/       # UI Components
│   ├── context/          # Global state
│   ├── lib/              # Utilities
│   └── models/           # Database models
```
