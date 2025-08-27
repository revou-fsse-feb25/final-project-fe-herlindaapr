# Fuwa Touch - Beauty Service Booking Platform

A modern web application for beauty service bookings, featuring nail art, eyelash extensions, and other beauty treatments. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### For Customers
- **Service Browsing**: View detailed pricelist with real-time pricing from database
- **Online Booking**: Book multiple services with preferred date and time
- **User Dashboard**: Track booking history, status, and manage appointments
- **Booking Management**: Edit booking details (services, date, time) or cancel bookings
- **Search Functionality**: Find specific bookings using search filters
- **Responsive Design**: Optimized for desktop and mobile devices

### For Admins
- **Admin Dashboard**: Overview of business statistics and recent orders
- **Service Management**: Create, edit, delete, and manage all services
- **Booking Management**: View all bookings, update status, add notes
- **User Management**: Access to customer information and booking history
- **Search & Filter**: Advanced filtering for bookings and services
- **Real-time Updates**: Live data synchronization across all interfaces

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based authentication system
- **State Management**: React Context API
- **API Integration**: RESTful API with custom client
- **UI Components**: Custom modal system, form validation
- **Date Handling**: Native JavaScript Date API

## 📁 Project Structure

```
fuwa-touch/
├── src/
│   └── app/
│       ├── admin/                 # Admin panel pages
│       │   ├── page.tsx          # Admin dashboard
│       │   └── services/         # Service management
│       ├── components/           # Reusable UI components
│       │   ├── AdminDashboard.tsx
│       │   ├── BookingForm.tsx
│       │   ├── EditBookingModal.tsx
│       │   ├── Hero.tsx
│       │   ├── Navbar.tsx
│       │   ├── Pricelist.tsx
│       │   └── SearchBar.tsx
│       ├── contexts/             # React contexts
│       │   └── AuthContext.tsx   # Authentication context
│       ├── services/             # API services
│       │   └── api.ts           # API client and endpoints
│       ├── types/               # TypeScript definitions
│       │   └── index.ts         # Centralized type definitions
│       ├── user/                # Customer dashboard
│       │   └── page.tsx         # User booking history
│       ├── globals.css          # Global styles
│       ├── layout.tsx           # Root layout
│       └── page.tsx             # Homepage
├── public/                      # Static assets
│   ├── logo.png
│   └── [various service images]
└── [config files]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd fuwa-touch
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 API Endpoints

The application integrates with the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Bookings
- `GET /bookings` - Get all bookings (admin)
- `GET /bookings/my-bookings` - Get user's bookings
- `POST /bookings` - Create new booking
- `PATCH /bookings/:id/user-update` - Update booking (user)
- `PATCH /bookings/:id/status` - Update booking status (admin)
- `DELETE /bookings/:id` - Delete booking

### Services
- `GET /services` - Get all services
- `POST /services` - Create service (admin)
- `PATCH /services/:id` - Update service (admin)
- `DELETE /services/:id` - Delete service (admin)

### Users
- `GET /users` - Get all users (admin)

## 🎨 UI Components

### Core Components
- **Hero**: Landing page hero section with eye-tracking animation
- **Navbar**: Navigation with authentication state management
- **Pricelist**: Dynamic service listing with real-time pricing
- **BookingForm**: Multi-service booking form with validation
- **SearchBar**: Reusable search component with filtering

### Modal Components
- **LoginModal**: User authentication modal
- **RegisterModal**: User registration modal
- **EditBookingModal**: Booking editing with service selection
- **ServiceEditModal**: Admin service management modal
- **BookingDetailsModal**: Detailed booking information

### Dashboard Components
- **AdminDashboard**: Business analytics and recent orders
- **UserDashboard**: Personal booking history and management

## 🔐 Authentication System

### User Roles
- **Customer**: Can book services, view/edit own bookings
- **Admin**: Full access to all bookings, services, and user management

### Authentication Flow
1. User registers/logs in via modal
2. JWT token stored in localStorage
3. Token sent with API requests via Authorization header
4. Auto-logout on token expiration

## 💼 Business Logic

### Booking System
- **Multi-Service Booking**: Users can book multiple services in one order
- **Dynamic Pricing**: Total calculated from selected services and quantities
- **Status Management**: Pending → Confirmed → Completed workflow
- **Edit Restrictions**: Cannot edit completed/cancelled bookings

### Service Management
- **Real-Time Updates**: Changes reflect immediately across all interfaces
- **Validation**: Price and duration validation with user-friendly errors
- **Search Integration**: Services searchable by name and description

## 🎯 Key Features Implementation

### Dynamic Pricelist
- Fetches real-time data from API
- Categorizes services (Nail Arts vs Eyelashes)
- Loading states and error handling
- Responsive grid layout

### Booking Management
- **For Users**: Edit services, date/time, or delete bookings
- **For Admins**: Update status, add notes, view all details
- **Confirmation Dialogs**: Prevent accidental deletions
- **Real-time Updates**: Changes sync across all users

### Search & Filter
- **Real-time Search**: Instant filtering as user types
- **Multi-field Search**: Searches names, descriptions, IDs, dates
- **Case Insensitive**: Flexible search experience
- **Empty States**: Clear messaging when no results found

## 🔧 Development

### Code Organization
- **Centralized Types**: All TypeScript interfaces in `/types/index.ts`
- **API Client**: Unified API client with error handling
- **Component Reusability**: Shared components across admin/user interfaces
- **Context Management**: Authentication state management

### Best Practices
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Error boundaries and loading states
- Consistent UI patterns
- Accessible form controls

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Rich desktop experience with larger screens
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all environment variables are set for production:

- `NEXT_PUBLIC_API_BASE_URL`: Production API endpoint

## Screenshots

### Homepage
<img width="1424" height="785" alt="Screenshot 2025-08-27 at 11 27 27" src="https://github.com/user-attachments/assets/dffdaa5b-b3f0-4e4d-a49b-94fcef7a4ebd" />

### Booking form
User View
<img width="1416" height="786" alt="Screenshot 2025-08-27 at 11 29 00" src="https://github.com/user-attachments/assets/82fc4390-4e99-43a8-9aa3-662cde070be1" />

Admin View (button not available in admin mode)
<img width="1421" height="785" alt="Screenshot 2025-08-27 at 11 30 17" src="https://github.com/user-attachments/assets/76b3ee85-5a63-403b-ad52-69d5a2de2ded" />

###Admin Panel
<img width="1422" height="778" alt="Screenshot 2025-08-27 at 11 31 28" src="https://github.com/user-attachments/assets/91068379-472d-437e-b6ba-7c558077cf13" />

###Admin Edit Modal
<img width="1431" height="772" alt="Screenshot 2025-08-27 at 11 33 16" src="https://github.com/user-attachments/assets/3655bc31-e740-4174-8531-2b54e1449457" />

###Service Panel (admin)
<img width="1418" height="767" alt="Screenshot 2025-08-27 at 11 34 14" src="https://github.com/user-attachments/assets/ba02d4f2-5b66-4f1c-8744-23622cd93fb5" />

###Edit Service Modal (admin)
<img width="1422" height="769" alt="Screenshot 2025-08-27 at 11 35 40" src="https://github.com/user-attachments/assets/10e2066c-4653-482d-8a9c-da101a529759" />

###User Dashboard
<img width="1428" height="739" alt="Screenshot 2025-08-27 at 11 37 31" src="https://github.com/user-attachments/assets/46766542-2f80-4621-ae71-19e9f520b224" />

###User Edit Booking Modal
<img width="1433" height="783" alt="Screenshot 2025-08-27 at 11 39 46" src="https://github.com/user-attachments/assets/f400c86b-e9ef-4c86-98b7-af837f3225bc" />


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**Fuwa Touch** - Making beauty service booking simple and elegant ✨
