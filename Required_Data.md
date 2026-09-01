# 📋 PERSQFT CONSTRUCTIONS — Production Data Requirements Checklist

This document lists **all dummy/placeholder data** currently used across the PERSQFT website codebase. To prepare for 100% real production deployment, replace the placeholder items below with your firm's official details.

---

## 📞 1. Company Contact & Business Info

| Item | Current Dummy Value | Real Value Required | Code Location |
| :--- | :--- | :--- | :--- |
| **Primary Phone Number** | `+91 98765 43210` / `+91 91234 56789` | Official Firm Phone Number | `ContactSection.tsx`, `Footer.tsx` |
| **WhatsApp Number** | `+91 98765 43210` | Direct Business WhatsApp Number | `ContactSection.tsx`, `Footer.tsx` |
| **Primary Email** | `contact@persqft.com` | Official Enquiry Email | `ContactSection.tsx`, `Footer.tsx`, `EnquiryModal.tsx` |
| **Support / Careers Email** | `careers@persqft.com` | Official HR / Support Email | `Footer.tsx` |
| **Physical HQ Address** | `Plot 42, Shaheed Path, Gomti Nagar Extension, Lucknow, UP - 226010` | Full Registered Office Address | `ContactSection.tsx`, `Footer.tsx` |
| **Regional Office 2** | `Civil Lines, Kanpur, Uttar Pradesh - 208001` | Secondary Branch / Site Office Address | `ContactSection.tsx` |
| **Operating Hours** | `Mon - Sat: 9:00 AM - 7:00 PM (IST)` | Official Working Hours | `ContactSection.tsx` |
| **GST / Registration No.** | `#09AAAAA0000A1Z5` | Official GST / RERA Registration No. | `Footer.tsx` |

---

## 🦸‍♂️ 2. Leadership & Team Members (`TeamSection.tsx`)

*Currently using Marvel Cinematic Universe (MCU) placeholder names & Unsplash portrait photos.*

| Role | Current Dummy Name | Required Real Detail | Media Asset Needed |
| :--- | :--- | :--- | :--- |
| **Founder & CEO** | `Tony Stark` | Real Founder / Managing Director Name & Bio | High-res Professional Headshot (JPG/PNG) |
| **Co-Founder & Director** | `Steve Rogers` | Real Co-Founder / Director Name & Bio | High-res Professional Headshot (JPG/PNG) |
| **Co-Founder & Operations** | `Nick Fury` | Real Co-Founder / COO Name & Bio | High-res Professional Headshot (JPG/PNG) |
| **Lead Structural Engineer**| `Bruce Banner` | Real Chief Structural Engineer Name | Headshot Avatar / Photo |
| **Junior Civil Engineer** | `Peter Parker` | Real Project Engineer Name | Headshot Avatar / Photo |
| **Project Head & Safety** | `Natasha Romanoff` | Real Operations Head Name | Headshot Avatar / Photo |
| **Heavy Machinery Head** | `Thor Odinson` | Real Site Manager Name | Headshot Avatar / Photo |
| **Chief Interior Architect**| `Wanda Maximoff` | Real Interior Lead Name | Headshot Avatar / Photo |
| **Spatial Design Consultant**| `Stephen Strange` | Real Architectural Design Consultant Name | Headshot Avatar / Photo |

---

## 🏗️ 3. Portfolio & Featured Projects (`src/data/projectsData.ts`)

*Currently using simulated architectural projects and stock CAD photography.*

| Project ID | Current Title | Required Real Project Details | Required Assets |
| :--- | :--- | :--- | :--- |
| `01` | **The Crest Penthouse** | Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |
| `02` | **Aura Sky Villa** | Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |
| `03` | **Zenith Eco-Residence** | Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |
| `04` | **Starlight Pavilion** | Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |
| `05` | **Monolith Commercial Center**| Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |
| `06` | **Vanguard Tech Park** | Real Project Name, Location, Built Area (sqft), Year, Status | High-res Cover Image + 4 Gallery Shots |

---

## 💬 4. Client Testimonials (`TestimonialsSection.tsx`)

*Currently using generated client reviews and placeholder client identities.*

| Client Name | Current Location & Designation | Required Real Feedback |
| :--- | :--- | :--- |
| **Ananya & Rohan Malhotra** | `Gomti Nagar Extension, Lucknow (Villa Build)` | Authentic Client Quote & Approved Avatar Photo |
| **Dr. Sameer Verma** | `Civil Lines, Kanpur (Commercial Clinic)` | Authentic Client Quote & Approved Avatar Photo |
| **Priya & Vikram Singhania**| `Sushant Golf City, Lucknow (Interior Turnkey)` | Authentic Client Quote & Approved Avatar Photo |

---

## 🌐 5. Social Media & Legal Links

| Platform | Current Link | Real Link Required |
| :--- | :--- | :--- |
| **LinkedIn** | `https://linkedin.com` | Official PERSQFT Company LinkedIn Page |
| **Instagram** | `https://instagram.com` | Official PERSQFT Instagram Handle |
| **Facebook** | `https://facebook.com` | Official PERSQFT Facebook Page |
| **YouTube** | `https://youtube.com` | Official PERSQFT Channel (for walkthrough videos) |
| **Google Maps Embed** | Generic Lucknow map iframe | Precise Google Maps Pin Embed URL for HQ |

---

## 📩 6. Backend Form Submission Setup

- **Inquiry Form Endpoint**: Currently targets `/api/enquiry.php` (frontend includes simulated response fallback).
- **Backend Action Needed**: Connect `/api/enquiry.php` or your preferred email service (e.g. Resend, SendGrid, Webhook, or PHP `mail()`) to send notifications directly to `contact@persqft.com` when a client submits the "Get a Quote" modal or Contact Form.
