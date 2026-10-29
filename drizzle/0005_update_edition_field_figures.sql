UPDATE editions
SET attendance = 250,
    reach = 200,
    summary = 'The 28 October 2025 outreach at Government Technical Secondary School, Njimtilo recorded 250 people: 200 students, 30 mothers, 10 volunteers, and 10 staff. The team distributed menstrual pads and provided hygiene education.'
WHERE slug = '1-0';

UPDATE editions
SET attendance = 440,
    summary = 'Held January 22 to 26, 2026 across three institutions: Government Girls Secondary School, Yerwa; Continuing Education Institute / Agency for Mass Literacy; and Federal Government Girls College, Monguno. The report records 440 people: 410 students, 14 volunteers, and 16 staff across the three schools.'
WHERE slug = '2-0';

UPDATE editions
SET attendance = 325,
    reach = 260,
    summary = 'The 25–31 May 2026 drive in Maiduguri recorded 325 people: 260 girls, 50 mothers, 10 volunteers, and 5 staff. It provided pads and hygiene kits, menstrual health sensitisation, and support to keep girls in school.'
WHERE slug = '3-0';

UPDATE editions
SET status = 'COMPLETED_REPORT_PENDING',
    attendance = 264,
    reach = 150,
    summary = 'The 23–24 October 2026 outreach recorded 264 people: 150 girls, 100 boys, 5 male staff, and 9 volunteers. The field report is pending.'
WHERE slug = '4-0';

UPDATE posts
SET title = 'Pad A Girl 4.0: Outreach figures',
    category = 'Impact Report',
    excerpt = 'The 23–24 October 2026 outreach recorded 264 people, including 150 girls, 100 boys, 5 male staff, and 9 volunteers. The official report is pending.',
    body = 'Pad A Girl 4.0 took place on 23–24 October 2026. The outreach recorded 264 people: 150 girls, 100 boys, 5 male staff, and 9 volunteers.\n\nThe official field report is pending. See the Impact page for figures from all four editions.'
WHERE slug = 'pad-a-girl-4-0-announced';
