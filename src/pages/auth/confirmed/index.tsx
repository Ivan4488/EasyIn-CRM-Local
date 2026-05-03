import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout"
import { supabaseInstance } from "~/service/supabase";

type ParsedAccessToken = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  type: string;
};

function parseAccessToken(query: string): ParsedAccessToken {
  const params = new URLSearchParams(query);
  return {
    access_token: params.get("#access_token") || "",
    expires_at: parseInt(params.get("expires_at") || "0", 10),
    expires_in: parseInt(params.get("expires_in") || "0", 10),
    refresh_token: params.get("refresh_token") || "",
    token_type: params.get("token_type") || "",
    type: params.get("type") || "",
  };
}

export default function EmailConfirmed() {
  const router = useRouter();

  useEffect(() => {
    supabaseInstance.auth
      .setSession(parseAccessToken(window.location.hash))
      .then(() => {
        router.push("/");
      });
  }, []);

  return (
    <AuthLayout>
      <div className="flex justify-center items-center mt-[120px]">
        <h1>Email verified</h1>
      </div>
    </AuthLayout>
  );
}
