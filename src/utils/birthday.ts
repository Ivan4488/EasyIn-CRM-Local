import { format } from "date-fns";

export const BIRTHDAY_PLACEHOLDER_YEAR = 1800;

export const isBirthdayYearUnknown = (date: Date): boolean =>
  date.getFullYear() === BIRTHDAY_PLACEHOLDER_YEAR;

export const formatDateValue = (date: Date): string =>
  isBirthdayYearUnknown(date) ? format(date, "MMM d") : format(date, "PPP");
