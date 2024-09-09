export async function authorizeAdmin(req, res, next) {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      throw new Error("Access denied");
    }

    next();
  } catch (error) {
    next(error);
  }
}
