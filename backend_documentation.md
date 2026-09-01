# 🛠️ PERSQFT CONSTRUCTIONS — Backend Architecture & Data Flow Documentation

This document outlines the proposed **Backend Technical Stack**, **Database Schema**, **API Specification**, and **Data Flow Architecture** for the PERSQFT CONSTRUCTIONS web application. It evaluates the most optimized backend options to transition from static simulation to a production-grade enterprise system.

---

## 🎯 1. Architectural Goals

- **High Availability & Low Latency**: Fast response times (<100ms) for inquiry submissions and portfolio fetching.
- **Seamless TypeScript Ecosystem**: Type safety from the database schema down to the React frontend.
- **Instant Client Notification**: Real-time email and WhatsApp alerts sent to firm management when a client requests a quote.
- **Secure File Ingestion**: Safe handling of CAD drawings, PDF blueprints, and image attachments up to 10MB.

---

## 🚀 2. Recommended Technology Stack Options

### Option A: Node.js (TypeScript) + Express / Hono + PostgreSQL (Prisma ORM) — *⭐ RECOMMENDED*

> **Best for long-term scalability, clean code reuse, and seamless integration with the existing React/TypeScript codebase.**

| Component | Recommended Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime & Language** | **Node.js 22 LTS + TypeScript** | Native async capabilities, type safety across full stack |
| **API Framework** | **Hono.js / Express** | Ultra-lightweight, edge-compatible framework with minimal overhead |
| **Database** | **PostgreSQL (Supabase / Neon)** | Relational database ideal for structured project data & inquiries |
| **ORM** | **Prisma / Drizzle ORM** | Type-safe query builder with automated migrations |
| **File Storage** | **Cloudflare R2 / AWS S3** | S3-compatible object storage with zero egress fees for CAD/PDF files |
| **Mail Engine** | **Resend API / SendGrid** | High deliverability transactional emails with HTML templates |
| **SMS / WhatsApp** | **Twilio Business API** | Instant WhatsApp notifications to firm management upon inquiry |

---

### Option B: Vercel Serverless Functions + Supabase (Zero Infrastructure)

> **Best for zero-maintenance hosting, keeping frontend and backend unified on Vercel.**

- **Endpoints**: `/api/enquiry.ts`, `/api/projects.ts` running on Vercel Edge Serverless functions.
- **Database & Auth**: Supabase PostgreSQL with built-in Row-Level Security (RLS).
- **Pros**: Automatic scaling, zero server management, cost-effective for medium traffic.

---

## 🗄️ 3. Database Schema Design (PostgreSQL / MySQL)

### Table 1: `inquiries` (Client Quote Requests)
```sql
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(20) UNIQUE NOT NULL, -- e.g. PSQFT-849201
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service_required VARCHAR(100) NOT NULL,
    area_sqft VARCHAR(50) NOT NULL,
    project_note TEXT,
    attachment_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, REVIEWED, CONTACTED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: `projects` (Portfolio Management)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Residential, Commercial, Interior, Villa
    location VARCHAR(100) NOT NULL,
    area VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL, -- ONGOING, COMPLETED
    progress INT DEFAULT 100, -- 0 to 100 percentage
    cover_image VARCHAR(255) NOT NULL,
    gallery JSONB DEFAULT '[]', -- Array of image URLs
    features JSONB DEFAULT '[]', -- Array of technical specification strings
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Table 3: `team_members` (Leadership & Personnel)
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL, -- MANAGEMENT, EMPLOYEE
    avatar_url VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    verified BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0
);
```

---

## 📡 4. RESTful API Endpoint Specifications

### `POST /api/v1/enquiries` — Submit Project Inquiry
- **Request Body** (`multipart/form-data`):
  ```json
  {
    "name": "Vikramaditya Sharma",
    "phone": "+91 98765 43210",
    "service": "Residential Construction",
    "area": "2000 - 5000 sqft",
    "message": "Planning a 3-floor villa build in Golf City, Lucknow."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Inquiry registered successfully",
    "reference_id": "PSQFT-739102"
  }
  ```

### `GET /api/v1/projects` — Fetch Portfolio Projects
- **Query Params**: `?category=Residential&status=COMPLETED`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 6,
    "data": [ /* Array of project objects */ ]
  }
  ```

---

## 🔄 5. End-to-End Data Flow Workflow

```
[ Client Browser ]
       │
       ▼ (Submits "Get a Quote" Form)
[ React Frontend (EnquiryModal.tsx) ]
       │
       ▼ (HTTP POST /api/v1/enquiries)
[ Node.js / Serverless API Gateway ]
       │
       ├──► 1. Input Sanitization & Rate Limiting (express-rate-limit)
       ├──► 2. File Upload Handling (Save blueprint PDF to S3 / R2)
       ├──► 3. Insert record into PostgreSQL (`inquiries` table)
       ├──► 4. Dispatch Email Alert via Resend API to contact@persqft.com
       └──► 5. Dispatch Auto-Responder Email & WhatsApp to Client
       │
       ▼ (Returns Reference ID)
[ React Frontend displays "INQUIRY RECEIVED! #PSQFT-XXXXXX" ]
```

---

## 🛡️ 6. Security & Performance Best Practices

1. **Rate Limiting**: Restrict `/api/v1/enquiries` to a maximum of 5 requests per IP per hour to prevent spam bot submissions.
2. **CORS Policy**: Restrict API access exclusively to trusted origins (`https://persqft.vercel.app`).
3. **Payload Sanitization**: Escape all user input using `DOMPurify` / `validator` to prevent SQL Injection and XSS attacks.
4. **Presigned Upload URLs**: Generate short-lived AWS S3 / Cloudflare R2 presigned URLs for client drawing uploads to avoid passing heavy files directly through backend memory.
