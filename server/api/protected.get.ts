import { ensureAuthenticated } from "../handlers/ensureAuthenticated";

export default defineEventHandler(async (event) => {
  const { user, error } = await ensureAuthenticated(event);
  if (error) {
    return error;
  }

  // 2 -> editor
  // 3 -> admin
  if (![2, 3].includes(user.role)) {
    event.res.statusCode = 403;

    return {
      message: "You has'nt permission to see this content!",
    };
  }

  return {
    result:
      "This is a protected content! (Verified at Server side and Client side)",
  };
});
