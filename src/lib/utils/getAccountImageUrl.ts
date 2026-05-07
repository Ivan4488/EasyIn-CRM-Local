import { getSupabaseImg } from "~/service/supabase"

export const getAccountImgUrl = (url: string) => {
  if (url.includes("media.licdn.com")) {
    // Use our proxy endpoint for LinkedIn images
    return `${process.env.NEXT_PUBLIC_API_URL}/proxy/img?url=${encodeURIComponent(url)}`;
  }

  return getSupabaseImg({ img: url, bucket: "account-imgs" });
};
