import { type SessionConfig, useSession, clearSession, updateSession } from "vinxi/http";
import { type Session } from "@supabase/supabase-js";
import { createSupabase } from "../supabase/setup";
import { query } from "@solidjs/router";

export const sessionConfig = {
  password: process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : "temporary_secrettemporary_secrettemporary_secrettemporary_secrettemporary_secrettemporary_secret",
} as SessionConfig;

export type SessionData = {
  session: Session;
};
// 示例配合supabase使用。
// 获取session直接使用api返回的session
// 更新session直接使用updateSession
// 删除session直接使用clearSession(sessionConfig)

// 获取有效session
export async function getValidSession(): Promise<SessionData | null> {
  "use server";

  const {data : localSessionData} = await useSession<SessionData>(sessionConfig);

  if (localSessionData.session?.expires_at) {
    const expiresAt = localSessionData.session.expires_at;
    const currentTime = Math.floor(Date.now() / 1000);
    if (expiresAt - currentTime < 20) {
      const supabase = createSupabase();
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: localSessionData.session.refresh_token,
      });
      if (error) {
        console.error("Error refreshing token:", error.message);
        const _ =  await clearSession(sessionConfig); // 清空session
        return null;
      }
      if (data.session) {
        const _ = await updateSession<SessionData>(sessionConfig, { session: data.session }); //更新session
      }
    }
  }
  return localSessionData;
}

export const authenticateUser = query(async () => {
  "use server";

  const localSession = await getValidSession();
  return Boolean(localSession?.session) ? localSession?.session?.user : null;
}, "authenticate-user");

