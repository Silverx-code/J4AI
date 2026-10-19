-- Publish the updated user-provided reach, campaign goals, and payment account.
UPDATE editions SET reach = 1000,
    summary = 'A five-day outreach across three schools in Maiduguri and Monguno, reaching 1,000 adolescent girls and students with hygiene kits and menstrual health education, and reaching 100 young mothers and mothers.'
WHERE slug = '2-0';

UPDATE editions SET target_reach = 395,
    target_description = 'Campaign goal: reach 395 girls through public secondary schools and IDP camps in Borno State.'
WHERE slug = '3-0';

UPDATE editions SET target_reach = 500,
    pillars = ARRAY['Hygiene Kits', 'Stigma Eradication', 'Dignity Workshops', 'Boys'' Education']
WHERE slug = '4-0';

INSERT INTO settings (key, value) VALUES ('account_number', '9044131859')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
