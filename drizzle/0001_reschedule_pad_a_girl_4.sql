UPDATE editions
SET start_date = '2026-10-23',
    end_date = '2026-10-24'
WHERE slug = '4-0';

UPDATE posts
SET title = 'Pad A Girl 4.0 is coming: 23–24 October 2026',
    excerpt = 'Our next outreach is set for 23–24 October 2026. Volunteers and sponsors are invited to join.',
    body = regexp_replace(body, '15[–-]16 October 2026', '23–24 October 2026', 'g')
WHERE slug = 'pad-a-girl-4-0-announced';
