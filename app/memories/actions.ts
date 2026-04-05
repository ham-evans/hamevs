"use server";

import { cookies } from "next/headers";

const PASSWORD = process.env.MEMORIES_PASSWORD;

export async function verifyPassword(password: string) {
  if (password === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("memories_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/memories",
    });
    return true;
  }
  return false;
}

export async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("memories_auth")?.value === "true";
}
