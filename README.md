# User Management Dashboard

A modern, responsive, and robust User Management Dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and an integrated **Node/Vite Backend API**.

![User Management Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

---

## Features

- **Live Backend API Integration**: Fetches user data via standard HTTP `GET /api/users` with support for server-side query filters, status updates, user creation, deletion, and dataset resets.
- **Interactive Metrics Bar**: Real-time statistics counters for *Total Users*, *Active Accounts*, *Pending Verification*, and *Suspended Users*. Clicking any stat card instantly filters the dashboard.
- **Search & Multi-Filter Controls**:
  - Instant live search matching names, emails, roles, and departments (keyboard shortcut `/` to focus).
  - Status filter dropdown (`All`, `Active`, `Pending`, `Suspended`, `Inactive`).
  - Role filter dropdown (`All`, `Admin`, `Manager`, `Developer`, `Designer`, `Support`).
  - Multi-attribute sorting (Joined Date, Last Active, Name, Role, Status) with Ascending/Descending toggle.
  - Active filter badges with one-click "Reset all filters" button.
- **Multiple Status Updating Mechanisms**:
  - **Inline Status Selector**: Click directly on any status badge in the table row to quickly update account status with instant feedback.
  - **User Details & Edit Modal**: View comprehensive profile information, activity audit timestamps, and toggle status.
  - **Floating Bulk Action Bar**: Select multiple users with row checkboxes or "Select All", and batch update their status (*Set Active*, *Suspend*, *Set Inactive*) simultaneously.
  - **Confirmation Dialog**: Protective confirmation modal for high-impact actions like account suspension.
- **Toast Notification System**: Instant, non-intrusive status change feedback alerts with auto-dismiss.
- **User Creation & Removal**: "+ Add User" modal with complete validation, plus delete user functionality with confirmation.
- **Demo Data Reset**: "Reset Demo" button in the header resets the backend in-memory dataset to the initial 14 accounts at any time.
- **Responsive Layout**: Fluid table view on desktop/tablet, stacked card layout on mobile.
- **Full Test Coverage**: 25 unit and integration tests covering backend API endpoints, client services, custom React hooks, and UI components using Vitest and React Testing Library.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Backend / Middleware**: Node.js HTTP handler with Vite dev/preview server middleware (`server/apiHandler.ts`)
- **Testing**: Vitest, React Testing Library, jsdom
- **Bundler**: Vite 6

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
npm install
```

### Running the Development Server

Starts both the Vite frontend and backend API endpoints on `http://localhost:5173`:

```bash
npm run dev
```

### Running Automated Tests

Run the Vitest test suite:

```bash
npm test
```

Or watch mode:

```bash
npm run test:watch
```

### Building for Production

Compile TypeScript and build the production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Fetch all users with optional `?search=&status=&role=` queries and stats |
| `GET` | `/api/users/:id` | Fetch a single user by ID |
| `PATCH` | `/api/users/:id/status` | Update a user's account status (`{ status: "Active" \| "Suspended" \| ... }`) |
| `POST` | `/api/users/bulk-status` | Bulk update status for multiple users (`{ userIds: string[], status: string }`) |
| `POST` | `/api/users` | Create a new user (`{ name, email, role, status, department, location }`) |
| `PUT` | `/api/users/:id` | Update user profile details |
| `DELETE` | `/api/users/:id` | Remove user |
| `POST` | `/api/reset` | Reset backend in-memory database to initial 14 seed users |

---

## Project Structure

```
├── server/
│   ├── apiHandler.ts       # Backend REST API handler (Express/Node compatible)
│   ├── apiHandler.test.ts  # Integration tests for API endpoints
│   └── data.ts             # Initial realistic seed dataset (14 accounts)
├── src/
│   ├── components/
│   │   ├── AddUserModal.tsx          # Modal to create a new user
│   │   ├── BulkActionBar.tsx         # Floating dock for batch status actions
│   │   ├── ConfirmDialog.tsx         # Accessible confirmation modal
│   │   ├── Header.tsx                # Dashboard topbar & action buttons
│   │   ├── Pagination.tsx            # Paging controls & page-size selector
│   │   ├── RoleBadge.tsx             # Role badge with icons
│   │   ├── StatsCards.tsx            # Clickable metric overview cards
│   │   ├── StatusBadge.tsx           # Status badge with color coding
│   │   ├── StatusBadge.test.tsx      # Tests for status badge
│   │   ├── StatusSelectDropdown.tsx  # Quick inline status selector
│   │   ├── UserFilters.tsx           # Search, status/role dropdowns & sorting
│   │   ├── UserFilters.test.tsx      # Tests for filters
│   │   ├── UserModal.tsx             # Profile details & edit modal
│   │   ├── UserTable.tsx             # Responsive table with skeleton loading
│   │   └── UserTableRow.tsx          # Row renderer with desktop/mobile views
│   ├── context/
│   │   └── ToastContext.tsx          # Toast notification provider & container
│   ├── hooks/
│   │   ├── useUsers.ts               # Custom hook for filtering, sorting & mutations
│   │   └── useUsers.test.tsx         # Tests for hook state & optimistic updates
│   ├── services/
│   │   ├── api.ts                    # Typed HTTP client for /api endpoints
│   │   └── api.test.ts               # Unit tests for API client
│   ├── types/
│   │   └── user.ts                   # TypeScript interfaces & types
│   ├── App.tsx                       # Main dashboard container
│   ├── index.css                     # Tailwind CSS entry
│   └── main.tsx                      # React root entry
├── index.html                        # App entry HTML with font & favicon
├── tailwind.config.js                # Tailwind styling configuration
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite config with backend API plugin
```
