-- Create badge_entries table for office visit data
CREATE TABLE public.badge_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  office_location TEXT,
  checkin_time TIMESTAMP WITH TIME ZONE,
  checkout_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_entries table for PTO, sick days, etc.
CREATE TABLE public.user_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  type TEXT NOT NULL CHECK (type IN ('office-visit', 'sick', 'pto', 'event', 'holiday')),
  note TEXT,
  is_temp_badge BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_planned_days table for planning office days
CREATE TABLE public.user_planned_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  planned_days INTEGER[] NOT NULL,
  effective_from DATE,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.badge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_planned_days ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for badge_entries (read-only for all authenticated users)
CREATE POLICY "Everyone can view badge entries" ON public.badge_entries FOR SELECT USING (true);

-- Create RLS policies for user_entries (users can manage their own entries)
CREATE POLICY "Users can view their own entries" ON public.user_entries FOR SELECT USING (true);
CREATE POLICY "Users can create their own entries" ON public.user_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own entries" ON public.user_entries FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own entries" ON public.user_entries FOR DELETE USING (true);

-- Create RLS policies for user_planned_days (users can manage their own plans)
CREATE POLICY "Users can view planned days" ON public.user_planned_days FOR SELECT USING (true);
CREATE POLICY "Users can create their own planned days" ON public.user_planned_days FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own planned days" ON public.user_planned_days FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own planned days" ON public.user_planned_days FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_badge_entries_updated_at
  BEFORE UPDATE ON public.badge_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_entries_updated_at
  BEFORE UPDATE ON public.user_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_planned_days_updated_at
  BEFORE UPDATE ON public.user_planned_days
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_badge_entries_email ON public.badge_entries(email);
CREATE INDEX idx_badge_entries_date ON public.badge_entries(date);
CREATE INDEX idx_badge_entries_day_of_week ON public.badge_entries(day_of_week);

CREATE INDEX idx_user_entries_email ON public.user_entries(email);
CREATE INDEX idx_user_entries_date ON public.user_entries(date);
CREATE INDEX idx_user_entries_type ON public.user_entries(type);

CREATE INDEX idx_user_planned_days_user_id ON public.user_planned_days(user_id);
CREATE INDEX idx_user_planned_days_email ON public.user_planned_days(email);