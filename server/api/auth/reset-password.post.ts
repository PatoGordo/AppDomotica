import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateForm } from "js-laravel-validation";
import { prismaClient } from "~~/server/db-client";

export default defineEventHandler(async (event) => {
  const { token, password } = await useBody(event);

  const validation = validateForm({
    formData: {
      token: {
        value: token,
        validation: "required",
      },
      password: {
        value: password,
        validation: "required|min:6",
      },
    },
  });

  if (validation.errors) {
    return {
      message: "Check if all form fields are filled",
      errors: validation.errors,
    };
  }

  const tokenData = jwt.verify(token, process.env.JWT_SECRET);

  if (!tokenData) {
    event.res.statusCode = 403;

    return {
      message: "This link probably has been expired or not exists",
    };
  }

  const email = (tokenData as JwtPayload).email;
  const oldPassHash = (tokenData as JwtPayload).passwordHash;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
      status: {
        notIn: [0, 2],
      },
    },
  });

  if (user.password !== oldPassHash) {
    event.res.statusCode = 403;

    return {
      message: "This link probably has been expired or not exists",
    };
  }

  if (!user) {
    event.res.statusCode = 403;

    return {
      error: {
        message: "This user does not exists in our database or it was deleted!",
      },
    };
  }

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: bcrypt.hashSync(password, 8),
    },
  });

  return {
    message: "Your password has been successfully reseted!",
  };
});
