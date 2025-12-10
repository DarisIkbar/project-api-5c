import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth/jwt";
import { requireAdmin } from "@/lib/auth/role";
import { z } from "zod";
import { BookSchema } from "@/lib/validation/bookSchema";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// ==================== ZOD SCHEMA ====================
const BookUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

// ==================== GET BOOK BY ID ====================
export async function GET(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return Response.json(
        { success: false, error: "Invalid or missing book ID" },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return Response.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: book });
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ==================== UPDATE BOOK ====================
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return Response.json(
        { success: false, error: "Invalid or missing book ID" },
        { status: 400 }
      );
    }

    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json(
        { success: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const user = verifyJWT(token);
    if (!user) {
      return Response.json(
        { success: false, error: "invalid token" },
        { status: 401 }
      );
    }

    const roleCheck = requireAdmin(user);
    if (roleCheck) {
      return Response.json(roleCheck, { status: 403 });
    }

    const body = await req.json();

    // ==================== APPLY ZOD VALIDATION ====================
    const parsed = BookUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.format() },
        { status: 400 }
      );
    }

    const validatedData = parsed.data;

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.title.toLowerCase().replace(/\s+/g, "-"),
        content: validatedData.content || "",
      },
    });

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT BOOK ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ==================== DELETE BOOK ====================
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return Response.json(
        { success: false, error: "Invalid or missing book ID" },
        { status: 400 }
      );
    }

    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json(
        { success: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const user = verifyJWT(token);
    if (!user) {
      return Response.json(
        { success: false, error: "invalid token" },
        { status: 401 }
      );
    }

    const roleCheck = requireAdmin(user);
    if (roleCheck) {
      return Response.json(roleCheck, { status: 403 });
    }

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    await prisma.book.delete({ where: { id } });

    return Response.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
