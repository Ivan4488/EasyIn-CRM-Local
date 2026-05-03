import Cookies from "js-cookie";
import { Session } from "@supabase/supabase-js";

export const SESSION_KEY = "supabase_session";

/**
 * Set Supabase session in cookies
 */
export const setSessionCookie = (session: Session): void => {
  // Set cookie to expire in 1 month (30 days)
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  const expirationDate = Math.floor(oneMonthFromNow.getTime() / 1000);
  Cookies.set(SESSION_KEY, JSON.stringify(session), {
    expires: expirationDate,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

/**
 * Get Supabase session from cookies
 */
export const getSessionCookie = (): Session | null => {
  const sessionData = Cookies.get(SESSION_KEY);
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData) as Session;
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    return null;
  }
};

/**
 * Remove session from cookies
 */
export const removeSessionCookie = (): void => {
  Cookies.remove(SESSION_KEY);
};
