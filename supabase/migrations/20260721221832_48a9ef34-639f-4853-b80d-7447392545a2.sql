
CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  signer_name text,
  signer_cpf text,
  signer_ip text,
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.contracts TO anon, authenticated;
GRANT ALL ON public.contracts TO service_role;

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view contracts by id"
  ON public.contracts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can sign a pending contract"
  ON public.contracts FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (status IN ('pending','signed'));
