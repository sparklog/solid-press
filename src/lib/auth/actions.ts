import { action, redirect, revalidate } from "@solidjs/router";
import { createSupabase } from "../supabase/setup";
import { clearSession, updateSession } from "vinxi/http";
import { type SessionData, sessionConfig } from ".";

export const signInWithOtp = action(async (formData: FormData) => {
  "use server";
  const email = String(formData.get("email"));
  const supabase = createSupabase();
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    return error.message;
  }
  return data;
});

export const verifyOtp = action(async (email: string, token: string) => {
  "use server";
  const supabase = createSupabase();
  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: "email",
  });

  if (error) {
    return error.message;
  }

  if (data?.session) {
    const _ = await updateSession<SessionData>(sessionConfig, {
      session: data.session,
    });
  }
  return redirect("/", {
    revalidate: "authenticate-user",
  });
});

export const logout = action(async () => {
  "use server";
  const _ = await clearSession(sessionConfig);
  return revalidate("authenticate-user");
});
