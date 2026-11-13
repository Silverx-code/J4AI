UPDATE editions
SET reach = 410
WHERE slug = '2-0';

INSERT INTO settings (key, value)
VALUES ('girls_reached', '1020'), ('mothers_reached', '80')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
