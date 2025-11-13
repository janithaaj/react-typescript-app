# Diagram Editor

A web-based diagram editor built with React, TypeScript, and Firebase. Create, edit, and manage diagrams with an intuitive drag-and-drop interface.

## Features

- **Diagram Creation**: Build diagrams with draggable nodes and connectable edges
- **User Authentication**: Email/password authentication with Firebase
- **Role-Based Access**: Editor and Viewer roles with different permissions
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Diagrams are saved to Firestore and sync across sessions
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- React Flow for diagram editing
- Firebase (Authentication & Firestore)
- Tailwind CSS for styling
- React Router for navigation

## Prerequisites

Before you start, make sure you have:

- Node.js 22.7.0 or higher
- npm or yarn package manager
- A Firebase project set up (you'll need the config)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-typescript-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

You'll need to set up Firebase for authentication and Firestore. Here's what to do:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Firebase Authentication
3. Create a Firestore database
4. Copy your Firebase config

### 4. Environment Variables

Create a `.env.development` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the values with your actual Firebase configuration.

### 5. Firestore Rules

Make sure to deploy the Firestore security rules. The rules file is located at `firestore.rules`. You can deploy it using:

```bash
firebase deploy --only firestore:rules
```

Also deploy the indexes if needed:

```bash
firebase deploy --only firestore:indexes
```

### 6. Run the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Setting Up User Roles

To assign roles to users, you need to add a `role` field to the user document in Firestore:

1. Go to Firestore in Firebase Console
2. Create a collection called `users`
3. Add a document with the user's UID as the document ID
4. Add a field `role` with value either `"editor"` or `"viewer"`

Example:

```
Collection: users
Document ID: <user-uid>
Fields:
  - role: "editor" (or "viewer")
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Page components
├── services/         # Firebase and API services
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── config/           # Configuration files
└── navigation/       # Routing setup
```

## Deployment

The project is configured for Firebase Hosting. To deploy:

1. Build the project:

```bash
npm run build
```

2. Deploy to Firebase:

```bash
firebase deploy --only hosting
```

Make sure you're logged into Firebase CLI:

```bash
firebase login
```

## CI/CD

The project includes GitHub Actions workflow for automated deployment. It's configured to:

- Run on pushes to `main` branch
- Run linting and build checks
- Deploy to Firebase Hosting automatically

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- Pre-commit hooks to ensure code quality

## Notes

- The app uses React Router v7 for client-side routing
- Diagrams are stored in Firestore under the `diagrams` collection
- User roles are stored in the `users` collection
- The sidebar shows recent diagrams with pagination (loads 5 at a time)

## Troubleshooting

**Firebase connection issues**: Make sure your environment variables are set correctly and Firebase project is properly configured.

**Build errors**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

**Firestore permission errors**: Make sure you've deployed the Firestore rules and indexes.
