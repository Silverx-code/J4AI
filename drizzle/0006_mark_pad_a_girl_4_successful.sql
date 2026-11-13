UPDATE editions
SET status = 'COMPLETED',
    start_date = '2026-10-23',
    end_date = '2026-10-23',
    host_state = 'Borno State',
    locations = ARRAY['Government Secondary School, Maiduguri'],
    schools = 1,
    attendance = 264,
    reach = 150,
    summary = 'The October 23, 2026 outreach at Government Secondary School, Maiduguri recorded 264 people: 150 girls, 100 boys, 5 male teachers, and 9 volunteers. The official report is pending.'
WHERE slug = '4-0';

INSERT INTO settings (key, value)
VALUES ('girls_reached', '1150')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

UPDATE posts
SET excerpt = 'The October 23, 2026 outreach at Government Secondary School, Maiduguri recorded 264 people, including 150 girls, 100 boys, 5 male teachers, and 9 volunteers.',
    body = 'Pad A Girl 4.0 took place on October 23, 2026 at Government Secondary School, Maiduguri. The outreach recorded 264 people: 150 girls, 100 boys, 5 male teachers, and 9 volunteers.\n\nThe official field report is pending. See the Impact page for figures from all four editions.'
WHERE slug = 'pad-a-girl-4-0-announced';
