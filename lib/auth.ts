import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret";
const COOKIE_NAME = "4ar_admin";
const SESSION_DAYS = 7;

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export async function createSession() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const token = `${payload}.${sign(payload)}`;
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(payload) > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
