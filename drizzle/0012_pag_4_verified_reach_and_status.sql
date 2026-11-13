UPDATE editions
SET status = 'COMPLETED',
    reach = 250,
    attendance = 264,
    summary = 'The October 23, 2026 outreach at Government Secondary School, Maiduguri reached 250 beneficiaries: 150 girls and 100 boys. Five male teachers and 9 volunteers also participated, bringing total attendance to 264. The official report is pending.'
WHERE slug = '4-0';

UPDATE posts
SET excerpt = 'The October 23, 2026 outreach at Government Secondary School, Maiduguri reached 250 beneficiaries: 150 girls and 100 boys, with 264 people in total attendance.',
    body = 'Pad A Girl 4.0 took place on October 23, 2026 at Government Secondary School, Maiduguri. It reached 250 beneficiaries: 150 girls and 100 boys. Five male teachers and 9 volunteers also participated, bringing total attendance to 264.\n\nThe official field report is pending. See the Impact page for figures from all four editions.'
WHERE slug = 'pad-a-girl-4-0-announced';
