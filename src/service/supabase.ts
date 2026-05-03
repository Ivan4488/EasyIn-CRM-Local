// Mock supabase - no-op stubs for static UI clone
export const supabaseInstance = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
      upload: async () => ({ data: null, error: null }),
    }),
  },
} as any;

export function getSupabaseImg(_opts: { img: string; bucket?: string; html?: boolean }): string { return ""; }

export async function uploadSupabaseImg(_opts: { file: File; bucket?: string }) {
  return { data: null, error: null };
}

export async function getSupabaseUser() {
  return { data: { user: null }, error: null };
}

export function useSupabaseUser() {
  return { data: null, isLoading: false, error: null };
}
