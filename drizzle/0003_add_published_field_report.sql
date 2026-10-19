UPDATE editions SET schools = 1, attendance = 250, reach = 200,
    summary = 'The 28 October 2025 outreach at Government Technical Secondary School, Njimtilo recorded 250 attendees, including 200 students and 30 mothers. Ten volunteers supported pad distribution and menstrual hygiene education.',
    report_url = '/brand/PAG%201.0%20AND%202.0%20REPORT.pdf',
    report_label = 'PAG 1.0 & 2.0 official field report'
WHERE slug = '1-0';

UPDATE editions SET locations = ARRAY['Government Girls Secondary School, Yerwa', 'Continuing Education Institute / Agency for Mass Literacy', 'Federal Government Girls College, Monguno'],
    schools = 3, attendance = 440, reach = 265, target_reach = 600,
    summary = 'Held January 22 to 26, 2026 across three institutions: Government Girls Secondary School, Yerwa; Continuing Education Institute / Agency for Mass Literacy; and Federal Government Girls College, Monguno. The report records 440 attendees, including 410 students and 14 volunteers; its objectives cite 265 female students and 130 young mothers.',
    report_url = '/brand/PAG%201.0%20AND%202.0%20REPORT.pdf',
    report_label = 'PAG 1.0 & 2.0 official field report'
WHERE slug = '2-0';

INSERT INTO settings (key, value) VALUES
    ('additional_contact_email', 'subomijesusforallinitiative@gmail.com'),
    ('girls_reached', '1000'),
    ('mothers_reached', '160')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
