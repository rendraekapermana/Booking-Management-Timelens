ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS booking_id text,
  ADD COLUMN IF NOT EXISTS deduct_from_profit_sharing boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS expenses_booking_id_idx
  ON public.expenses (booking_id);

DO $$
DECLARE
  event_name_column text;
BEGIN
  SELECT column_name
    INTO event_name_column
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'expenses'
    AND column_name IN ('eventname', 'eventName')
  ORDER BY CASE WHEN column_name = 'eventname' THEN 0 ELSE 1 END
  LIMIT 1;

  IF event_name_column IS NOT NULL THEN
    EXECUTE format(
      $backfill$
        WITH unique_booking_names AS (
          SELECT
            lower(btrim(service_type::text)) AS normalized_name,
            min(id::text) AS booking_id
          FROM public.bookings
          WHERE nullif(btrim(service_type::text), '') IS NOT NULL
            AND btrim(service_type::text) <> '-'
          GROUP BY lower(btrim(service_type::text))
          HAVING count(*) = 1
        )
        UPDATE public.expenses AS expense
        SET booking_id = booking.booking_id
        FROM unique_booking_names AS booking
        WHERE expense.booking_id IS NULL
          AND lower(btrim(expense.%I::text)) = booking.normalized_name
      $backfill$,
      event_name_column
    );
  END IF;
END $$;
