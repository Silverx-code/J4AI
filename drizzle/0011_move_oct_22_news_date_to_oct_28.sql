UPDATE posts
SET published_at = TIMESTAMPTZ '2026-10-28 09:00:00+00'
WHERE published_at::date = DATE '2026-10-22';
