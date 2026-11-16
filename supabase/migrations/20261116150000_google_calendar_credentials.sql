CREATE TABLE IF NOT EXISTS public.google_calendar_credentials (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  encrypted_refresh_token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, email)
);

ALTER TABLE public.google_calendar_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS google_calendar_credentials_owner
  ON public.google_calendar_credentials;
CREATE POLICY google_calendar_credentials_owner
  ON public.google_calendar_credentials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.google_calendar_credentials
  TO authenticated;
