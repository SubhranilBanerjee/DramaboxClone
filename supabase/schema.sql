-- DramaBox Supabase Schema & Seed Migration
-- Enables UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    coin_balance INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DRAMAS TABLE
CREATE TABLE IF NOT EXISTS public.dramas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    total_episodes INTEGER NOT NULL DEFAULT 20,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EPISODES TABLE
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drama_id UUID NOT NULL REFERENCES public.dramas(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (drama_id, episode_number)
);

-- 4. USER UNLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.user_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, episode_id)
);

-- Indices for rapid query lookup
CREATE INDEX IF NOT EXISTS idx_episodes_drama_id ON public.episodes(drama_id);
CREATE INDEX IF NOT EXISTS idx_episodes_number ON public.episodes(drama_id, episode_number);
CREATE INDEX IF NOT EXISTS idx_user_unlocks_lookup ON public.user_unlocks(user_id, episode_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access for dramas"
    ON public.dramas FOR SELECT USING (true);

CREATE POLICY "Allow public read access for episodes"
    ON public.episodes FOR SELECT USING (true);

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own unlocks"
    ON public.user_unlocks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlocks"
    ON public.user_unlocks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, coin_balance)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), 100);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED DATA (High Production Dramas)
INSERT INTO public.dramas (id, title, description, cover_image_url, total_episodes, tags)
VALUES 
    (
        'a1111111-1111-1111-1111-111111111111',
        'The Billionaire''s Secret Heir',
        'Five years after being betrayed and cast out, Lucas returns in disguise as the ruthless empire CEO to reclaim his family honor and the woman he never stopped loving.',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        24,
        ARRAY['Billionaire', 'Revenge', 'Secret Identity', 'Romance']
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'Revenge of the Discarded Heiress',
        'Cast aside by her fiancé for her step-sister, Elena reveals her true identity as the world''s top investor. Now, every single person who stepped on her must pay.',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        20,
        ARRAY['Revenge', 'Strong Female Lead', 'High Society', 'Drama']
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        'CEO''s Hidden Contract Bride',
        'A temporary marriage of convenience turns intoxicatingly real when cold-blooded magnate Alexander realizes his unassuming bride carries secrets that could shatter his world.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        22,
        ARRAY['Contract Marriage', 'Enemies to Lovers', 'CEO', 'Romance']
    ),
    (
        'd4444444-4444-4444-4444-444444444444',
        'Midnight Whispers: Shadows of Greed',
        'When an elusive detective infiltrates the elite gala of the city''s wealthiest cartel, she uncovers an empire built on lies, betrayal, and a forbidden obsession.',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        18,
        ARRAY['Suspense', 'Mystery', 'Forbidden Love', 'Thriller']
    ),
    (
        'e5555555-5555-5555-5555-555555555555',
        'The Phoenix Empress Returns',
        'Reborn after a tragic betrayal in the ancient imperial court, the warrior princess takes the throne back sword by sword in this intense historical power struggle.',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        30,
        ARRAY['Historical', 'Empress', 'Reincarnation', 'Action']
    ),
    (
        'f6666666-6666-6666-6666-666666666666',
        'Double Life: The Undercover Doctor',
        'By day a modest emergency clinic intern, by night the undisputed syndicate leader who swore to protect one innocent dancer caught in the crossfire.',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        20,
        ARRAY['Action', 'Medical', 'Protector', 'Suspense']
    )
ON CONFLICT (id) DO NOTHING;
