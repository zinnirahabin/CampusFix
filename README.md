# CampusFix – Campus Facility Issue Reporting and Management System

CampusFix is a modern, responsive web application designed for university students to report campus infrastructure and facility problems, and for university administrators to efficiently triage, assign, and track maintenance repairs.

---

## 🚀 Phase 1: Frontend Interface & Interactive Prototype

This phase delivers a fully interactive frontend interface with realistic Malaysian university mock data (Universiti Tenaga Nasional - UNITEN), local state persistence (`localStorage`), role-switching capabilities, and complete workflows for both **Students** and **Administrators**.

### Key Features Implemented

#### 🎓 Student Portal
1. **Public Landing Page**: Hero section, live issue statistics, 7 maintenance categories showcase, 3-step workflow, and role comparisons.
2. **Authentication**:
   - Student & Administrator sign-in with **1-Click Demo Login** buttons.
   - Student registration page with student ID, university email, and college selection.
3. **Student Dashboard**:
   - Welcome banner with student profile.
   - KPI metric cards: Total Reports, Pending Review, In Progress, Resolved.
   - Campus maintenance advisory announcements.
   - Recent submitted requests with live status badges.
4. **Submit Maintenance Report**:
   - Visual category picker for the 7 categories.
   - Structured campus location selector (Building, Floor, Room/Lab).
   - Priority severity selection (Low, Medium, High, Urgent).
   - Photographic evidence uploader with drag-and-drop preview, sample photo presets, and deletion.
   - Submission confirmation modal with reference ID generation (`CF-2024-XXX`).
5. **My Reports Page**:
   - Filter by status tabs (*All, Pending, In Progress, Resolved, Rejected*).
   - Instant search by title, location, reference ID, or description.
   - Filter by category and sorting by date.
   - Dual view toggle: **Card Grid View** or **Compact Table View**.
6. **Report Details Page**:
   - Progress timeline stepper (*Submitted → Under Review → Assigned & In Progress → Resolved*).
   - Photographic evidence gallery with full-resolution lightbox viewer.
   - Location details breakdown and student reporter details.
   - Maintenance log with assigned technician information.
   - Discussion and activity updates thread.
7. **Student Profile & Account Settings**:
   - Edit personal details (Full Name, Contact Phone, Bio).
   - Academic program and College/Faculty enrollment.
   - Campus residence hostel & room number (e.g., Murni Residence Block B).
   - Emergency contact person and phone number.
   - Avatar customizer: 1-click presets or custom photo upload.
   - Password update & security settings.
   - Notification preferences (Email status updates, SMS alerts, Weekly digest).

#### 🛡️ Administrator Management Suite
1. **Admin Operations Dashboard**:
   - University facility telemetry: Total Reports, Pending, In Progress, Resolved, Rejected, and Resolution Efficiency Rate.
   - Priority Action Queue highlighting urgent/high severity open incidents.
   - Category distribution visual progress bars.
   - Quick-action status update modal.
2. **Report Management Console**:
   - Filterable data table with multi-criteria search (ID, title, student, location).
   - 1-Click status transition (*Pending → In Progress → Resolved / Rejected*).
   - Assign technician/contractor unit (e.g., HVAC team, plumbing unit, AV team).
   - Photo thumbnail inspection modal.
   - **CSV Export** feature for generating maintenance audit reports.
3. **Facility Categories Management**:
   - View all 7 core categories and live complaint counts.
   - Add new custom categories.
   - Toggle category Active/Inactive status.
4. **Student Directory**:
   - Searchable directory of registered student accounts, faculty, and reports filed.

---

## 🛠️ Technology Stack
- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Language**: JavaScript (ES Modules)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Fonts**: Plus Jakarta Sans & Inter
- **State & Storage**: React Context API with automatic `localStorage` synchronization

---

## 📂 Project Structure

```
CampusFix/
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Tailwind theme extensions & brand colors
├── postcss.config.js            # PostCSS configuration
├── src/
│   ├── main.jsx                 # React root mounting with Providers
│   ├── App.jsx                  # Route definitions (Public, Student, Admin)
│   ├── index.css                # Tailwind directives and custom scrollbars
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.jsx           # Top header with role switcher & user menu
│   │       ├── Sidebar.jsx          # Collapsible responsive sidebar
│   │       ├── DashboardLayout.jsx  # Main application layout wrapper
│   │       ├── StatusBadge.jsx      # Color-coded badge (Pending, In Progress, etc.)
│   │       ├── PriorityBadge.jsx    # Priority indicator (Urgent, High, Med, Low)
│   │       ├── CategoryBadge.jsx    # Category badge with icons
│   │       ├── StatCard.jsx         # KPI overview metric cards
│   │       └── Modal.jsx            # Reusable popup dialog modal
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication state & role switcher
│   │   └── ReportContext.jsx        # Reports CRUD, categories, & stats engine
│   ├── data/
│   │   └── mockData.js              # Realistic seed data (UNITEN campus issues)
│   ├── pages/
│   │   ├── LandingPage.jsx          # Public showcase & informational landing
│   │   ├── LoginPage.jsx            # Dual student/admin sign-in with 1-click fill
│   │   ├── RegisterPage.jsx         # Student account registration
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx # Student home overview & recent issues
│   │   │   ├── SubmitReportPage.jsx # Multi-field complaint form with photo upload
│   │   │   ├── MyReportsPage.jsx    # Searchable list with card/table views
│   │   │   └── ReportDetailsPage.jsx# Full details, photo lightbox, & timeline
│   │   └── admin/
│   │       ├── AdminDashboard.jsx   # Admin statistics, triage queue & charts
│   │       ├── AdminReportsPage.jsx # Full management console with CSV export
│   │       ├── AdminCategoriesPage.jsx # Manage maintenance categories
│   │       └── AdminStudentsPage.jsx   # Registered student directory
│   └── utils/
│       └── formatters.js            # Date formatting and relative timestamp utilities
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port indicated in your terminal).

### 3. Build for Production
```bash
npm run build
```

---

## 💡 Evaluator & Presentation Quick Tips
- **Role Switcher in Navbar**: Click **"Student View"** or **"Admin View"** at the top of the screen anytime to instantly experience both perspectives.
- **Demo Logins**: On `/login`, click the **"Student Login"** or **"Admin Login"** buttons to auto-authenticate without typing.
- **Real-Time Data Sync**: If you submit a new report as a student, switch to the Admin view to immediately see the report in the Admin triage queue, assign a technician, and mark it **In Progress** or **Resolved**.
