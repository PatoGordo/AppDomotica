import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "../db-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensureAuthenticated(event: any): Promise<{
  user?: User;
  error?: object;
}> {
  const tokenHeader = event.req.headers.authorization;

  if (!tokenHeader) {
    event.res.statusCode = 403;

    return {
      error: {
        message: "You must to be loggedin to make this action",
      },
    };
  }

  const token = tokenHeader.split("Bearer ")[1];

  if (!token) {
    event.res.statusCode = 403;

    return {
      error: {
        message: "You must to be loggedin to make this action",
      },
    };
  }

  const isSignedIn = jwt.verify(token, process.env.JWT_SECRET);

  if (!isSignedIn) {
    event.res.statusCode = 403;

    return {
      error: {
        message: "You must to be loggedin to make this action",
      },
    };
  }

  const id = (isSignedIn as JwtPayload).id;

  const user = await prismaClient.user.findFirst({
    where: {
      id,
      status: {
        notIn: [0, 2],
      },
    },
  });

  if (!user) {
    event.res.statusCode = 403;

    return {
      error: {
        message:
          "Probabily your user has been deleted or unactive, contact the admin to solve that.",
      },
    };
  }

  return { user };
}
