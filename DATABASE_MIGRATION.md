# Database Migration - Supabase to MongoDB

This document outlines the changes made to remove all Supabase references from the codebase and prepare it for MongoDB integration.

## Changes Made

### Backend Changes

#### 1. Configuration (`backend/src/config/index.ts`)
- Removed Supabase configuration section
- Added MongoDB database configuration
- Updated required environment variables:
  - Removed: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
  - Added: `DATABASE_URL`

#### 2. Database Models (`backend/src/models/`)
- Created `User.ts` - Mongoose model for users
- Created `Company.ts` - Mongoose model for companies
- Both models include proper TypeScript interfaces and Mongoose schemas

#### 3. Database Connection (`backend/src/config/db/mongo-db.ts`)
- Implemented MongoDB connection using Mongoose
- Added connection lifecycle management
- Proper error handling and logging

#### 4. Service Layer (`backend/src/services/`)
- Created `UserService.ts` - Service layer for user operations
- Created `CompanyService.ts` - Service layer for company operations
- Both services provide database abstraction

#### 5. Authentication Routes (`backend/src/routes/auth.ts`)
- Removed all Supabase database calls
- Replaced with MongoDB service calls
- Fixed JWT signing issues
- Maintained all existing functionality

#### 6. Authentication Middleware (`backend/src/middleware/auth.ts`)
- Removed Supabase dependency
- Updated to use UserService for user verification
- Maintained all existing authentication logic

#### 7. Package Dependencies (`backend/package.json`)
- Removed: `@supabase/supabase-js`
- Kept: `mongoose` (already present)

#### 8. Application Bootstrap (`backend/src/app.ts`)
- Added MongoDB connection initialization

### Frontend Changes

#### 1. Environment Variables (`frontend/src/vite-env.d.ts`)
- Removed Supabase environment variables
- Added `VITE_BACKEND_URL` for API communication

#### 2. Package Dependencies (`frontend/package.json`)
- Removed: `@supabase/supabase-js`

## Next Steps

### 1. Environment Setup
Create a `.env` file in the backend directory with:
```env
DATABASE_URL=mongodb://localhost:27017/whatsapp_bot
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key
```

### 2. Database Setup
1. Install MongoDB locally or use a cloud service
2. Run `npm install` in the backend directory
3. Start the application with `npm run dev`

### 3. Update Other Routes
The following route files may still contain Supabase references and need to be updated:
- `backend/src/routes/companies.ts`
- `backend/src/routes/teams.ts`
- `backend/src/routes/users.ts`
- `backend/src/routes/publications.ts`
- `backend/src/routes/metrics.ts`
- `backend/src/routes/whatsapp.ts`

### 4. Create Database Schemas
You may need to create additional Mongoose models for:
- Teams
- Publications
- Metrics
- Social Accounts
- AI Settings
- Engagement Data

### 5. Data Migration
If you have existing data in Supabase, you'll need to:
1. Export data from Supabase
2. Transform it to MongoDB format
3. Import it into your MongoDB instance

## Testing
1. Start MongoDB service
2. Run `npm install` in both backend and frontend directories
3. Start the backend with `npm run dev`
4. Test the authentication endpoints:
   - POST `/api/auth/login`
   - POST `/api/auth/register`
   - POST `/api/auth/create-super-admin`

## Notes
- The JWT signing has been fixed to use a literal string for `expiresIn` to resolve TypeScript issues
- All database operations now use the service layer pattern for better maintainability
- Error handling and logging have been preserved throughout the migration
- The authentication middleware has been updated to work with the new database structure
