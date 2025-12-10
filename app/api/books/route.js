import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth/jwt";
import { requireAdmin } from "@/lib/auth/role";
import { BookSchema } from "@/lib/validation/bookSchema";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    success: true,
    data: books,
  });
}

export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json(
        { success: false, error: "unauthorized", code: 401 },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const user = verifyJWT(token);

    if (!user) {
      return Response.json(
        { success: false, error: "invalid token", code: 401 },
        { status: 401 }
      );
    }

    const roleCheck = requireAdmin(user);
    if (roleCheck) {
      return Response.json(roleCheck, { status: 403 });
    }

    const body = await req.json();

    // 🔥 VALIDASI ZOD DI SINI (di DALAM POST)
    const parsed = BookSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const book = await prisma.book.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        userId: user.userId,
      },
    });

    return Response.json({ success: true, data: book });
  } catch (error) {
    console.error("POST BOOK ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
