/**
 * Sentinel value used as the URL segment and route param when property settings
 * are opened in detached (account-wide) mode — i.e. not tied to a specific record.
 */
export const DETACHED_PROPERTIES_ID = "schema" as const;

/**
 * Maps a properties context to its left-menu store key.
 * Single source of truth — import this wherever the mapping is needed.
 */
export const PROPERTIES_CONTEXT_MAP = {
  contacts:  "contact-properties/main",
  companies: "company-properties/main",
  accounts:  "account-properties/main",
  team:      "team-properties/main",
} as const;

export type PropertiesContext = keyof typeof PROPERTIES_CONTEXT_MAP;
export type PropertiesMenuKey = typeof PROPERTIES_CONTEXT_MAP[PropertiesContext];
