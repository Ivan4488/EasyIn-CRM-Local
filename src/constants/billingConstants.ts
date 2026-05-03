/**
 * Billing pricing constants — single source of truth for all pricing math.
 * Update these when pricing changes; all UI derives from these values automatically.
 */

/** Price per team member seat per month (USD) */
export const PRICE_PER_SEAT = 49;

/** Price per watched profile per month (USD) */
export const PRICE_PER_WATCHED_PROFILE = 0.10;

/** Free tier seat limit */
export const FREE_SEAT_LIMIT = 1;

/** Free tier watched profiles limit */
export const FREE_WATCHED_PROFILES_LIMIT = 25;
