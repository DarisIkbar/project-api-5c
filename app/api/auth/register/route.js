import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const exists = await prisma.user.findUnique({
      where: { email }
    });

    if (exists) {
      return Response.json({ error: "Email sudah digunakan." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    return Response.json({ message: "Registrasi berhasil", user });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
