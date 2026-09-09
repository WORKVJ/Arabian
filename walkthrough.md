# Custom Client Admin Portal Walkthrough

We have created a dedicated, separate **Custom Client Admin Portal** tailored specifically for the client/customer to manage technical blogs, showcase engineering projects, and inspect incoming contact queries and RFQ quote requests.

---

## 1. What Was Built

### 🔐 Dedicated Authentication & Access System
- **Endpoint**: `/api/v1/auth/login/`, `/api/v1/auth/me/`, `/api/v1/auth/logout/`, `/api/v1/auth/stats/`, `/api/v1/auth/upload/`
- **Security**: Django REST Framework Token Authentication with password hashing and session tokens.
- **Role Verification**: Allows any registered staff user (`is_staff=True`) or superuser to log in securely with username or email.

### 📊 Overview & Real-Time KPI Dashboard
- **Location**: `/admin` (Default tab: `Dashboard Overview`)
- **Metrics Tracked**:
  - Total Incoming Inquiries & New/Unread Count with alert pills.
  - RFQ Quote Requests & Pending Customer Submissions.
  - Technical Articles Count & Live Published Posts.
  - Total GCC & Saudi Infrastructure Showcase Projects.
- **Quick Action Buttons**: 1-click navigation to write articles, post new projects, or inspect leads.

### 📬 Leads & RFQ Inquiries Manager
- **Sub-Tabs**:
  1. **Contact Enquiries**: General enquiries from `/contact`.
  2. **RFQ Quote Requests**: Engineering RFQs with product specs, dimensions, material types, and CAD drawing attachments.
- **Features**:
  - Live search across name, company, email, phone, and message.
  - Filter by status (`NEW`, `CONTACTED`, `QUOTATION_SENT`, `IN_PROGRESS`, `CLOSED`, `SPAM`).
  - Interactive **Details Modal** with direct `mailto:` reply and `tel:` dialer buttons.
  - Technical CAD drawings & spec sheets download links.
  - Instant status updater dropdown (`New Lead` -> `Contacted` -> `Closed`).

### ✍️ Blog & Article Publisher
- **Features**:
  - Grid card view with live thumbnail preview, category badge, and status pill (`Published` vs `Draft`).
  - Search by article title or keywords.
  - **Article Editor Modal**:
    - Title & auto-generating URL slug.
    - Category selector.
    - Status switcher (`Published` vs `Draft`).
    - Drag & drop cover image uploader (JPEG, PNG, WebP) with live thumbnail preview.
    - Short excerpt for card teasers and SEO.
    - Full markdown / HTML body content editor.
    - SEO Meta title and description inputs.
    - "Pin as Featured Post" toggle.

### 🏗️ Showcase Projects Manager
- **Features**:
  - Interactive cards of grating installations with project photography.
  - **Project Editor Modal**:
    - Project Title & URL slug.
    - Project Location (e.g., `Riyadh, Saudi Arabia`, `Dubai, UAE`, `Jubail Industrial City`).
    - Installation Date selector.
    - Active / Inactive website visibility toggle.
    - Homepage Featured toggle.
    - Drag & drop on-site photo uploader.
    - Multi-line technical scope and specifications.

---

## 2. Updated Architecture & Routing

| URL Route | Handled By | Purpose |
| :--- | :--- | :--- |
| `/admin` | **Next.js Frontend** | Dedicated Custom Client Admin Portal (Branded dark UI with brass accents) |
| `/api/v1/auth/` | **Django REST** | Token login, user verification, upload media, dashboard statistics |
| `/api/v1/enquiries/` | **Django REST** | Leads list, retrieve, status update, delete (Protected) |
| `/api/v1/blog/` | **Django REST** | Public list/detail, Authenticated staff CRUD for articles |
| `/api/v1/projects/` | **Django REST** | Public list/detail, Authenticated staff CRUD for showcase projects |
| `/secure-admin/` | **Django Backend** | Raw Django low-level database admin (for developer use) |

---

## 3. How to Update the Live Droplet

In your active SSH terminal connected to `root@161.35.211.116`, copy and paste this single command to pull the latest code, update Nginx, run migrations, and rebuild the frontend:

```bash
cd /var/www/arabian/Arabian_gratings && git pull origin main && sed -i '/location \/admin\/ {/,+6d' /etc/nginx/sites-available/arabian && nginx -t && systemctl reload nginx && cd backend && source venv/bin/activate && python manage.py migrate && systemctl restart arabian-backend && cd ../frontend && npm run build && pm2 restart arabian-frontend
```

## 3. Verified Live Deployment

![Client Portal Admin Login](file:///C:/Users/91811/.gemini/antigravity-ide/brain/05c4e294-8e89-4995-9757-835315affd18/login_screen_1788956338472.png)

The Client Portal is confirmed live and verified on the server:
- **URL**: `http://161.35.211.116/portal` (and `/admin`)
- **Components**: Overview KPI Dashboard, RFQ & Contact Leads Manager, Blog Publisher, and Showcase Projects Manager.

### Setting Up / Resetting Client Admin Credentials (if not yet done)

In your terminal connected to the droplet, run:

```bash
cd /var/www/arabian/Arabian_gratings/backend && source venv/bin/activate && python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); u, _=User.objects.get_or_create(username='admin', defaults={'is_staff': True, 'is_superuser': True}); u.set_password('Admin@Arabian2026'); u.is_staff=True; u.is_superuser=True; u.save(); print('>>> Admin portal account ready: username: admin | password: Admin@Arabian2026')"
```

