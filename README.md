# PentaCopy - AI Copying Assistant

PentaCopy is a modern web application that provides users with AI-powered content creation capabilities using Google's Gemini AI. Users can sign up, subscribe to different plans, and use credits to interact with the AI to generate various types of content.

## Features

- Beautiful landing page with multiple sections:
  - Hero section
  - Features overview
  - About us
  - Pricing plans (monthly & yearly)
  - Contact form
  - Footer with social links and newsletter signup

- User authentication:
  - Registration
  - Login
  - Password reset functionality
  - Protected routes

- Chat interface:
  - Real-time interaction with AI
  - Credit system (each AI response costs credits)
  - Chat history storage
  - Chat history viewing and management

## Tech Stack

- React (with Vite)
- Tailwind CSS for styling
- React Router for navigation
- Supabase for authentication and database
- Google Gemini AI for content generation

## Getting Started

### Prerequisites

- Node.js (version 16.x or higher)
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pentacopy.git
   cd pentacopy
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Set up your Supabase project:
   - Create the following tables:
     - `profiles`: For user information and credit tracking
     - `chat_history`: For storing user interactions with the AI

5. `profiles` table schema:
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade primary key,
     updated_at timestamp with time zone,
     username text unique,
     full_name text,
     avatar_url text,
     credits integer not null default 1000,
     plan text not null default 'basic'
   );

   -- Enable RLS
   alter table profiles enable row level security;

   -- Create policies
   create policy "Users can view their own profile." 
     on profiles for select 
     using (auth.uid() = id);

   create policy "Users can update their own profile." 
     on profiles for update 
     using (auth.uid() = id);
   ```

6. `chat_history` table schema:
   ```sql
   create table chat_history (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     prompt text not null,
     response text not null,
     tokens_used integer not null,
     created_at timestamp with time zone default now()
   );

   -- Enable RLS
   alter table chat_history enable row level security;

   -- Create policies
   create policy "Users can view their own chat history."
     on chat_history for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own chat history."
     on chat_history for insert
     with check (auth.uid() = user_id);

   create policy "Users can delete their own chat history."
     on chat_history for delete
     using (auth.uid() = user_id);
   ```

7. Set up a Supabase function for user profile creation:
   ```sql
   -- Function to create a profile when a new user signs up
   create or replace function handle_new_user()
   returns trigger as $$
   begin
     insert into public.profiles (id, full_name, avatar_url, credits, plan)
     values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 1000, 'basic');
     return new;
   end;
   $$ language plpgsql security definer;

   -- Trigger the function every time a user is created
   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure handle_new_user();
   ```

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production

1. Build the project:
   ```
   npm run build
   ```

2. Preview the production build:
   ```
   npm run preview
   ```

## Project Structure

```
pentacopy/
├── public/             # Static assets
├── src/
│   ├── lib/            # Utility libraries
│   │   └── supabase.js # Supabase client configuration
│   │
│   ├── pages/          # Page components
│   │   ├── Landing.jsx # Landing page
│   │   ├── auth/       # Authentication pages
│   │   └── app/        # Protected application pages
│   │
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
│
├── .env                # Environment variables (not in repo)
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Project dependencies
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)
- [Google Gemini AI](https://gemini.google.com/)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` (or use the existing `.env` file)
   - Add your Gemini API key to the `VITE_GEMINI_API_KEY` variable
   
   ```
   VITE_GEMINI_API_KEY=your-actual-api-key-here
   ```

   You can get a Gemini API key from the [Google AI Studio](https://makersuite.google.com/app/apikey).

4. Start the development server:
   ```
   npm run dev
   ```

## Features

- Chat with AI using Google's Gemini model
- Save and manage chat sessions
- Simple credit-based system (1 credit per AI response)
- Modern and responsive UI

## Environment Variables

- `VITE_GEMINI_API_KEY`: Your Gemini API key (required)
- `VITE_SUPABASE_URL`: Supabase project URL for authentication and database
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payments

## Technologies

- React
- Vite
- Supabase (Authentication, Database)
- Google Gemini API
- Framer Motion for animations

## Database Migration

To add the metadata column to the chat_messages table, run the following SQL query against your Supabase database:

```sql
-- Migration to add metadata column to chat_messages table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS metadata JSONB;
COMMENT ON COLUMN chat_messages.metadata IS 'Additional metadata for the message such as chunking info';
```

You can run this using the Supabase dashboard SQL editor or through the Supabase CLI:

```bash