export function requireAdmin(user) {
  if (!user || user.role !== "ADMIN") {
    return {
      success: false,
      error: "forbidden",
      code: 403
    };
  }
  return null;
}
