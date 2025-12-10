import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true }
    });

    return Response.json({ message: "Logout berhasil" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
