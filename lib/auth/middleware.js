import { NextResponse } from "next/server";
import { verifyJWT } from "./jwt";

export function middleware(req) {
  const authHeader = req.headers.get("authorization");

  // === CEK TOKEN ADA ATAU TIDAK ===
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // HANYA VERIFIKASI → TIDAK RETURN DATA
    verifyJWT(token);

    // WAJIB → agar request lanjut ke route API
    return NextResponse.next();

  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Invalid Token", code: 401 },
      { status: 401 }
    );
  }
}

// WAJIB → agar params tidak hilang pada App Router
export const config = {
  matcher: "/api/:path*",
};
