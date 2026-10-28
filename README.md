# User Management Dashboard

A modern, responsive, and robust User Management Dashboard built with **React**, **TypeScript**, and **Tailwind CSS**, consuming a live **mockapi.io** backend.

---

## Features

- **Direct MockAPI Integration**: Directly integrates with `https://6ae1eb66bbb5412922995b6b.mockapi.io/usermanagement/users` for all CRUD and status operations without needing any local Node.js backend server.
- **Interactive Metrics Bar**: Real-time statistics counters for *Total Users*, *Active Accounts*, and *Inactive Accounts*. Clicking any stat card filters the table.
- **Search & Multi-Filter Controls**:
  - Live instant search filtering users by name, email, role, or ID (keyboard shortcut `/` to focus).
  - Status filter dropdown (`All`, `Active`, `Inactive`).
  - Role filter dropdown dynamically populated from active roles.
  - Multi-attribute sorting (ID, Name, Email, Role, Status) with Ascending/Descending toggle.
  - Active filter badges with one-click "Reset all filters" button.
- **Pagination**: Configured to display 5 users per page with page jump and per-page options (5, 8, 15, 25).
- **Multiple Status Updating Mechanisms**:
  - **Inline Status Selector**: Click directly on any status badge in the table row to toggle or select account status.
  - **User Details & Edit Modal**: Edit user details directly and sync to MockAPI.
  - **Bulk Action Dock**: Select multiple users with row checkboxes or "Select All" to bulk update status.
  - **Confirmation Dialog**: Protective confirmation modal when deactivating accounts.
- **Toast Notification System**: Instant feedback for status changes and network operations.
- **User Creation & Removal**: "+ Add User" modal with complete validation, plus delete user functionality with confirmation.
- **Responsive Layout**: Fluid table view on desktop/tablet, stacked card layout on mobile.
- **Full Test Coverage**: Unit and integration tests covering the MockAPI client, custom React hooks, and UI components using Vitest and React Testing Library.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **API**: [mockapi.io](https://mockapi.io/) REST API
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

Starts the Vite frontend development server on `http://localhost:5173`:

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
