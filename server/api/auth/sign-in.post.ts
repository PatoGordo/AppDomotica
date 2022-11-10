import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prismaClient } from "~~/server/db-client";
import { validateForm } from "js-laravel-validation";
import moment from "moment";

export default defineEventHandler(async (event) => {
  const { email, password } = await useBody(event);

  const validation = validateForm({
    formData: {
      email: {
        value: email,
        validation: "required|email",
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

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (user.status === 0 || user.status === 2) {
    event.res.statusCode = 403;

    return {
      message:
        "Probabily your user has been deleted or unactive, contact the admin to solve that.",
    };
  }

  if (!user) {
    event.res.statusCode = 403;

    return {
      message: "Email or password went wrong!",
    };
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return {
      user,
      message: "You has been logged-in with success!",
      token,
      expires_at: moment().add(24, "h"),
    };
  } else {
    event.res.statusCode = 403;

    return {
      message: "Email or password went wrong!",
    };
  }
});
