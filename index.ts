// Supabase Edge Function "sync": PIN যাচাই করে তথ্য পড়া/লেখার একমাত্র পথ।
// ডাটাবেজের টেবিলে কোনো সরাসরি অ্যাক্সেস নেই (RLS), তাই অ্যাপ সরাসরি ডাটা পড়তে পারে না।
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const SALT = "hujaifa-2026";
const MAX_FAILS = 10;

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  const json = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad request" }, 400); }

  const { data: cfg } = await sb.from("app_config").select("pin_hash,fails").eq("id", 1).single();
  if (!cfg) return json({ error: "not configured" }, 500);
  if (cfg.fails >= MAX_FAILS) return json({ error: "locked" }, 429);

  const ok = (await sha256(SALT + ":" + String(body.pin || ""))) === cfg.pin_hash;
  if (!ok) {
    await sb.from("app_config").update({ fails: cfg.fails + 1 }).eq("id", 1);
    return json({ error: "wrong pin" }, 401);
  }
  await sb.from("app_config").update({ fails: 0 }).eq("id", 1);

  if (body.action === "check") return json({ ok: true });

  if (body.action === "pull") {
    const { data, error } = await sb.from("records").select("rid,data");
    if (error) return json({ error: error.message }, 500);
    return json({ rows: data });
  }

  if (body.action === "push") {
    const ups = (body.upserts || []).map((u: any) => ({ rid: u.rid, data: u.data }));
    const rem: string[] = body.removed || [];
    if (ups.length) {
      const { error } = await sb.from("records").upsert(ups, { onConflict: "rid" });
      if (error) return json({ error: error.message }, 500);
    }
    if (rem.length) {
      const { error } = await sb.from("records").delete().in("rid", rem);
      if (error) return json({ error: error.message }, 500);
    }
    return json({ ok: true });
  }

  return json({ error: "unknown action" }, 400);
});
