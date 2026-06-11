// Smoke test: uploads a tiny file to the gallery bucket, checks public URL, then removes it
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const name = `smoke-test-${Date.now()}.txt`;
const { error: upErr } = await supabase.storage
  .from("gallery")
  .upload(name, Buffer.from("4A storage ok"), { contentType: "text/plain" });
if (upErr) throw new Error("upload: " + upErr.message);

const { data } = supabase.storage.from("gallery").getPublicUrl(name);
const res = await fetch(data.publicUrl);
console.log("public URL status:", res.status, "| body:", await res.text());

const { error: rmErr } = await supabase.storage.from("gallery").remove([name]);
if (rmErr) throw new Error("remove: " + rmErr.message);
console.log("✓ Storage upload/público/remoção funcionando");
