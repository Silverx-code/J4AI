UPDATE editions
SET locations = ARRAY['Government Technical College, Njimtilo'],
    schools = 1,
    attendance = 250,
    reach = 200,
    summary = 'The 28 October 2025 outreach at Government Technical College, Njimtilo recorded 250 people: 200 girls, 30 mothers, 10 staff, and 10 volunteers. The team distributed menstrual pads and provided hygiene education.'
WHERE slug = '1-0';

UPDATE editions
SET attendance = 325,
    reach = 260,
    summary = 'The 25–31 May 2026 drive in Maiduguri recorded 325 people: 260 young girls, 50 mothers, 10 volunteers, and 5 staff members. It provided pads and hygiene kits, menstrual health sensitisation, and support to keep girls in school.'
WHERE slug = '3-0';
