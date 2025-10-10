# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

StyleWav is a modern e-commerce web application built with Next.js 15 for selling trendy t-shirts and streetwear. The application features a complete shopping experience with cart functionality, checkout process, and an admin panel for product management.

## Technology Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: Firebase Auth with Google OAuth support
- **Database**: JSON file-based database system (development/demo)
- **State Management**: Zustand for global state
- **UI Library**: Radix UI components via shadcn/ui
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

## Common Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server (after build)
npm start

# Linting
npm run lint
```

## Database Architecture

The application uses a JSON file-based database system located in `jsonDatabase/` with three main data files:

- `products.json` - Product catalog with inventory management
- `orders.json` - Order history and tracking
- `customers.json` - Customer profiles, carts, and wishlists

### Database Management

- **Products**: Managed via API routes in `app/api/admin/products/`
- **Orders**: Handled through `app/api/orders/`
- **Customers**: CRUD operations via `app/api/customers/`

Database utilities are in `lib/`:
- `database.ts` - Core file operations and product initialization
- `orders-database.ts` - Order management functions
- `customers-database.ts` - Customer data operations
- `database-types.ts` - TypeScript interfaces

## Application Structure

### Core Directories

- `app/` - Next.js App Router pages and API routes
  - `api/` - REST API endpoints for data operations
  - `cart/` - Shopping cart page
  - `checkout/` - Checkout process
- `components/` - Reusable React components
  - `ui/` - shadcn/ui component library
  - `site/` - Application-specific components
- `lib/` - Utilities, database functions, and configuration
- `hooks/` - Custom React hooks
- `styles/` - Global CSS and Tailwind configuration

### Key Features

- **Product Management**: Full CRUD via admin API with stock tracking
- **Shopping Cart**: Persistent cart with size/color selection
- **Authentication**: Firebase Auth integration with Google OAuth
- **Inventory System**: Size-based stock management with low-stock alerts
- **Order Processing**: Complete order lifecycle management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Testing Database Operations

To test database operations:

```bash
# Initialize products database (if empty)
curl -X GET http://localhost:3000/api/admin/products

# Create a test order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"test","customerEmail":"test@example.com",...}'

# Check order statistics
curl "http://localhost:3000/api/orders?stats=true"
```

## Firebase Configuration

Requires environment variables in `.env`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Product Data Management

Products support:
- Multiple images and size variants
- Size-specific stock tracking (`sizeStock` object)
- Unlimited stock flag for evergreen items
- Low stock threshold alerts
- Rating and review counts

Use scripts in `scripts/` directory for bulk product operations:
- `add-size-stock.js` - Add size-specific inventory
- `complete-product-data.js` - Enhance product information
- `fix-product-stock.js` - Repair stock inconsistencies

## Component Architecture

The application follows a component composition pattern:

- **Layout Components**: Header, Footer, AnnouncementBar
- **Product Components**: ProductGrid, ProductCard, CategoryTiles  
- **Interactive Components**: Cart, Checkout forms, Size selection modals
- **Auth Components**: Login/signup forms with Firebase integration

## shadcn/ui Integration

Components are configured in `components.json`:
- Style: "new-york" variant
- Base color: neutral
- CSS variables enabled
- TypeScript and RSC support
- Path aliases configured for clean imports

Add new shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```