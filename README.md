# XION Gaming Hub

A real-time gaming dashboard for tracking your gaming sessions, achievements, and progress across multiple platforms.

## Features

- **Real-time Game Tracking**: Track your gaming sessions with live timers
- **Achievement System**: Unlock and showcase your gaming achievements
- **Statistics & Analytics**: Detailed insights into your gaming habits
- **Social Features**: Connect with friends and compete on leaderboards
- **Game Library Management**: Organize and track your game collection
- **Goal Setting**: Set and track gaming objectives
- **Calendar Integration**: Plan your gaming sessions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions, Authentication)
- **Build Tool**: Vite
- **Mobile**: Capacitor (for mobile app deployment)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd xion-gaming-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Run the database migrations (see Database Setup below)

4. Start the development server:
```bash
npm run dev
```

### Database Setup

Create the following tables in your Supabase database:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_playtime INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  genre TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  total_playtime INTEGER DEFAULT 0,
  last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'backlog' CHECK (status IN ('playing', 'completed', 'backlog', 'abandoned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Extreme')),
  multiplayer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions table
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bronze', 'silver', 'gold', 'platinum')),
  rarity DECIMAL(5,2) NOT NULL CHECK (rarity >= 0 AND rarity <= 100),
  icon TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friends table
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own games" ON games FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON game_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own friends" ON friends FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Web Deployment

Build for production:
```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Netlify, Vercel, etc.).

### Mobile Deployment

1. Add Capacitor platforms:
```bash
npx cap add ios
npx cap add android
```

2. Build and sync:
```bash
npm run build
npx cap sync
```

3. Open in native IDEs:
```bash
npx cap open ios
npx cap open android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details