import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query"

export const supabaseInstance = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string,
);

export function getSupabaseImg({
  img,
  bucket = "message-imgs",
  html = false,
}: {
  img: string;
  bucket?: string;
  html?: boolean;
}) {
  if (img) {
    const { data: imgData } = supabaseInstance.storage
      .from(bucket)
      .getPublicUrl(img);

    if (imgData && imgData?.publicUrl) {
      if (html) {
        return `<img src=${imgData.publicUrl} />`;
      } else {
        return imgData.publicUrl;
      }
    }
  }

  return "";
}

export async function uploadSupabaseImg({
  file,
  bucket = "message-imgs",
}: {
  file: File;
  bucket?: string;
}) {
  const { data, error } = await supabaseInstance.storage
    .from(bucket)
    .upload(`public/img-${Math.random()}-${file.name}`, file);

  return { data, error };
}

export async function getSupabaseUser() {
  const { data, error } = await supabaseInstance.auth.getUser();
  return { data, error };
}

export const useSupabaseUser = () => {
  const supabaseUser = getSupabaseUser();
  return useQuery({
    queryKey: ["supabaseUser"],
    queryFn: () => supabaseUser,
  });
};
