export function requireAdmin(user) {
  if (!user || !user.role) {
    return { success: false, error: "Unauthorized: Missing role" };
  }

  if (user.role !== "admin") {
    return { success: false, error: "Forbidden: Admin only" };
  }

  return null; // role valid
}
