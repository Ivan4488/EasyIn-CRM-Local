import axios from "axios";
import { supabaseInstance } from "./supabase";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
  headers: { Authorization: "foobar" },
});

axiosClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // let Supabase handle session management and refreshing, and just get the current session when making requests
    const { data: { session } } = await supabaseInstance.auth.getSession();

    if (!session?.access_token) {
      window.location.href = "/auth/signin";
      return config;
    }

    config["headers"]["supabase"] = session.access_token;
  }
  return config;
});