import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();

    const tokenData = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!tokenData || tokenData.revoked) {
      return Response.json({ error: "Refresh token tidak valid" }, { status: 400 });
    }

    if (tokenData.expiresAt < new Date()) {
      return Response.json({ error: "Refresh token kadaluarsa" }, { status: 400 });
    }

    const accessToken = jwt.sign(
      { userId: tokenData.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return Response.json({ accessToken });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
