"use server";

import path from "path";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { QUOTE_STATUSES } from "@/lib/format";
import { supabaseAdmin, GALLERY_BUCKET } from "@/lib/supabase";

// ---------- Auth ----------

export async function login(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "E-mail ou senha inválidos." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) return { error: "A nova senha precisa de pelo menos 8 caracteres." };
  if (next !== confirm) return { error: "A confirmação não confere com a nova senha." };

  const user = await prisma.adminUser.findFirst();
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { error: "Senha atual incorreta." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  return { success: true };
}

// ---------- Quotes ----------

export async function updateQuoteStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!QUOTE_STATUSES.includes(status as (typeof QUOTE_STATUSES)[number])) return;
  await prisma.quote.update({ where: { id }, data: { status } });
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
}

export async function updateQuoteNotes(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await prisma.quote.update({ where: { id }, data: { notes } });
  revalidatePath(`/admin/quotes/${id}`);
}

// ---------- Gallery ----------

const ALLOWED_MEDIA: Record<string, "photo" | "video"> = {
  ".jpg": "photo",
  ".jpeg": "photo",
  ".png": "photo",
  ".webp": "photo",
  ".svg": "photo",
  ".mp4": "video",
  ".webm": "video",
};

export async function uploadGalleryItem(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!file || file.size === 0 || !title) return;
  if (file.size > 100 * 1024 * 1024) return; // 100 MB cap

  const ext = path.extname(file.name).toLowerCase();
  const mediaType = ALLOWED_MEDIA[ext];
  if (!mediaType) return;

  const fileName = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  const supabase = supabaseAdmin();
  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(fileName, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || undefined,
    });
  if (uploadError) {
    console.error("Supabase Storage upload failed:", uploadError.message);
    return;
  }
  const { data: publicUrl } = supabase.storage
    .from(GALLERY_BUCKET)
    .getPublicUrl(fileName);

  const maxSort = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
  await prisma.galleryItem.create({
    data: {
      type: mediaType,
      url: publicUrl.publicUrl,
      title,
      city,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function toggleGalleryPublished(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.galleryItem.update({
    where: { id },
    data: { published: !item.published },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.galleryItem.delete({ where: { id } });
  const marker = `/object/public/${GALLERY_BUCKET}/`;
  if (item.url.includes(marker)) {
    const fileName = item.url.split(marker)[1];
    try {
      await supabaseAdmin().storage.from(GALLERY_BUCKET).remove([fileName]);
    } catch {
      // file already removed — DB record is what matters
    }
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

// ---------- Testimonials ----------

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 5));
  const text = String(formData.get("text") ?? "").trim();
  if (!customerName || !text) return;
  await prisma.testimonial.create({
    data: { customerName, city, rating, text, approved: true },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialApproved(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) return;
  await prisma.testimonial.update({
    where: { id },
    data: { approved: !t.approved },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}

// ---------- Pricing ----------

export async function updateFlooringType(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const priceMin = Number(formData.get("priceMin"));
  const priceMax = Number(formData.get("priceMax"));
  const active = formData.get("active") === "on";
  if (!(priceMin > 0) || !(priceMax >= priceMin)) return;
  await prisma.flooringType.update({
    where: { id },
    data: { priceMin, priceMax, active },
  });
  revalidatePath("/admin/pricing");
  revalidatePath("/estimate");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function updateExtra(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const pricePerUnit = Number(formData.get("pricePerUnit"));
  const active = formData.get("active") === "on";
  if (!(pricePerUnit > 0)) return;
  await prisma.extra.update({
    where: { id },
    data: { pricePerUnit, active },
  });
  revalidatePath("/admin/pricing");
  revalidatePath("/estimate");
  revalidatePath("/services");
}
