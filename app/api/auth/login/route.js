import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return Response.json({ error: "Email tidak ditemukan" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Password salah" }, { status: 400 });
    }

    const accessToken = jwt.sign(
  { 
    userId: user.id,
    role: user.role   // ← WAJIB!
  },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);


    const refreshTokenString = crypto.randomUUID();

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return Response.json({
      message: "Login berhasil",
      accessToken,
      refreshToken: refreshTokenString,
      user,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
