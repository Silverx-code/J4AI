INSERT INTO settings (key, value)
VALUES ('additional_contact_phone', '07075288090')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

UPDATE posts
SET title = 'Volunteer call for Pad A Girl 5.0',
    slug = 'volunteer-call-pad-a-girl-5-0',
    body = replace(body, 'Pad A Girl 4.0', 'Pad A Girl 5.0')
WHERE slug = 'volunteer-call-pad-a-girl-4-0';
