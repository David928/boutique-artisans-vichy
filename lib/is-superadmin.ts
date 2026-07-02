import { createClient } from "@/lib/supabase/server";

/** Vrai si le compte actuellement connecté est le superadmin (SUPERADMIN_EMAIL). */
export async function isSuperAdmin(): Promise<boolean> {
  const superadminEmail = process.env.SUPERADMIN_EMAIL;
  if (!superadminEmail) return false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email?.toLowerCase() === superadminEmail.toLowerCase();
}
