# FoodOrderingApp

FoodOrderingApp is a React Native application for ordering food, built with Expo and Supabase. It supports user and admin roles, allowing users to browse menus, place orders, and manage their cart, while admins can manage products and view orders.

![App Screenshot](assets/images/app_image.png)

## Features

### User Features

- Browse menu items with images and prices
- Add items to the cart with size and quantity options
- View and manage cart items
- Place orders and view order history
- Secure payment processing with Stripe
- Receive push notifications for order updates

### Admin Features

- Create, update, and delete menu items
- View and manage orders
- Update order statuses
- Send notifications to users when order status changes

## Tech Stack

- **React Native**: For building the mobile application
- **Expo**: For development, deployment, and push notifications
- **Supabase**: For backend services, including authentication and database
- **TypeScript**: For type safety
- **Stripe**: For secure payment processing
- **Expo Notifications**: For push notifications

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zoro-chi/FoodOrderingApp.git
   cd FoodOrderingApp
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     # Supabase Configuration
     SUPABASE_URL=<your-supabase-url>
     SUPABASE_ANON_KEY=<your-supabase-anon-key>
     
     # Stripe Configuration
     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
     EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
     ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Folder Structure

```
FoodOrderingApp/
├── src/
│   ├── app/                # Application screens and layouts
│   ├── components/         # Reusable UI components
│   ├── constants/          # Constants like colors
│   ├── lib/                # Libraries and utilities (Supabase, Stripe, notifications)
│   ├── providers/          # Context providers (Auth, Cart, Query, Notifications)
│   ├── types/              # TypeScript type definitions
│   ├── api/                # API integration for orders and products
├── assets/                 # Static assets like images and fonts
├── supabase/               # Supabase Edge Functions and utilities
│   ├── functions/          # Serverless functions (payment processing, etc.)
├── .env                    # Environment variables
├── app.config.ts           # Expo app configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Scripts

- `npm start`: Start the development server
- `npm android`: Run the app on an Android emulator or device
- `npm ios`: Run the app on an iOS simulator or device
- `npm web`: Run the app in a web browser

## Environment Variables

The app uses the following environment variables:

- `SUPABASE_URL`: The URL of your Supabase instance
- `SUPABASE_ANON_KEY`: The anonymous key for your Supabase instance
- `STRIPE_SECRET_KEY`: Stripe secret key for backend payment processing
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for frontend integration
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for Expo

## Running the Backend Services

### Supabase Functions
For payment processing and other backend functionality, run:
```sh
npx supabase functions serve payment-sheet --env-file .env --no-verify-jwt
```

The `--no-verify-jwt` flag allows anonymous access to the payment endpoint.

### Push Notifications
Push notifications will work on physical devices when properly configured with an EAS project ID in your app.config.ts file. For testing, ensure you have:

1. An EAS account and project set up
2. Added the project ID to your configuration
3. Using a physical device (notifications don't work on simulators/emulators)