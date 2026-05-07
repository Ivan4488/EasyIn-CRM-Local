# Employee Count + Mailbox Pattern (Shared)

This project now uses shared patterns for mailbox-style properties.

## Shared UI shell
- `src/components/UI/Properties/Variants/MailboxDropdown.tsx`
- Used by both:
  - `EmailListDropdown.tsx`
  - `EmployeeCountListDropdown.tsx`

Do not duplicate base mailbox container/column frame logic in variant files.

## Canonical employee count shaping
- `src/utils/employeeCount.ts`

`normalizeEmployeeCountEntries(...)` is the canonical helper and should be reused by:
1. server/response mapping
2. modal bootstrapping/editing
3. LinkedIn snapshot shaping (where applicable)

## Rules
- Keep canonical base rows: Low / High / Range / LinkedIn
- Preserve user-added rows (Additional)
- Ensure one primary row always exists (default to Range)
- Keep `stringValue` synced to primary row

## Tests
- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Current normalization coverage: `src/utils/employeeCount.test.ts`
