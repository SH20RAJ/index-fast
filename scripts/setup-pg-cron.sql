-- Run this in your Postgres/Supabase SQL editor (with pg_cron extension enabled).
-- Replace the URL and secret before executing.

-- Optional cleanup if you re-run setup
-- SELECT cron.unschedule('indexfast-process-cron-jobs');

SELECT cron.schedule(
  'indexfast-process-cron-jobs',
  '* * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_DOMAIN/api/cron/process?limit=25',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', 'YOUR_CRON_SECRET'
      ),
      body := '{}'::jsonb
    );
  $$
);
