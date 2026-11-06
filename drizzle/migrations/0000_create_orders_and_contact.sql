CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  commune text NOT NULL,
  address text NOT NULL,
  notes text,
  items jsonb NOT NULL,
  total_fcfa integer NOT NULL,
  status text NOT NULL DEFAULT 'nouvelle',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can place orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);

CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  company text,
  quantity text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can send requests" ON public.contact_requests FOR INSERT TO anon WITH CHECK (true);