-- =============================================================================
-- 002_seed_donations.sql
-- Ref FTTG-103 / FTTG-82
--
-- Seeds the donations table with the 10 existing records from
-- data/donations.json. Uses ON CONFLICT DO NOTHING so it is safe
-- to run again without creating duplicates.
--
-- Run via:  node scripts/migrate.js   (runs after 001 automatically)
--       or: node scripts/seed.js      (standalone, reads from JSON at runtime)
--
-- NOTE: This static SQL matches the JSON file as of 2026-07-04.
-- For any new donations added after that date, use scripts/seed.js
-- which reads donations.json dynamically.
-- =============================================================================

INSERT INTO donations (id, full_name, display_name, amount, anonymous, contact, status, submitted_at)
VALUES
  (
    'd1a2b3c4-0001-4000-a000-000000000001',
    'Sarah Mitchell', 'Sarah M.', 200.00, FALSE, NULL, 'approved',
    '2026-06-30T14:23:00.000Z'
  ),
  (
    'd1a2b3c4-0002-4000-a000-000000000002',
    'David Kolawole', 'David K.', 150.00, FALSE, NULL, 'approved',
    '2026-06-30T09:15:00.000Z'
  ),
  (
    'd1a2b3c4-0003-4000-a000-000000000003',
    'Anonymous Donor', 'Anonymous', 100.00, TRUE, NULL, 'approved',
    '2026-06-29T19:45:00.000Z'
  ),
  (
    'd1a2b3c4-0004-4000-a000-000000000004',
    'Emmanuel Okafor', 'Emmanuel O.', 250.00, FALSE, NULL, 'approved',
    '2026-06-29T11:30:00.000Z'
  ),
  (
    'd1a2b3c4-0005-4000-a000-000000000005',
    'Grace Adeyemi', 'Grace A.', 150.00, FALSE, NULL, 'approved',
    '2026-06-28T16:00:00.000Z'
  ),
  (
    'd1a2b3c4-0006-4000-a000-000000000006',
    'Michael Thompson', 'Michael T.', 100.00, FALSE, NULL, 'approved',
    '2026-06-28T10:20:00.000Z'
  ),
  (
    'd1a2b3c4-0007-4000-a000-000000000007',
    'Anonymous Donor', 'Anonymous', 200.00, TRUE, NULL, 'approved',
    '2026-06-27T20:10:00.000Z'
  ),
  (
    'd1a2b3c4-0008-4000-a000-000000000008',
    'Jennifer Obi', 'Jennifer O.', 150.00, FALSE, NULL, 'approved',
    '2026-06-27T08:45:00.000Z'
  ),
  (
    'd1a2b3c4-0009-4000-a000-000000000009',
    'Anonymous Donor', 'Anonymous', 100.00, TRUE, NULL, 'approved',
    '2026-06-26T15:30:00.000Z'
  ),
  (
    'd1a2b3c4-0010-4000-a000-000000000010',
    'Pastor James Eze', 'Pastor James E.', 100.00, FALSE, NULL, 'approved',
    '2026-06-26T09:00:00.000Z'
  )
ON CONFLICT (id) DO NOTHING;
