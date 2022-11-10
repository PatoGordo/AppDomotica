import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prismaClient } from "~~/server/db-client";
import { validateForm } from "js-laravel-validation";
import moment from "moment";

export default defineEventHandler(async (event) => {
  const { name, email, password } = await useBody(event);

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
      name: {
        value: name,
        validation: "required",
      },
    },
  });

  if (validation.errors) {
    return {
      message: "Check if all form fields are filled",
      pt_message:
        "Verifique se todos os campos do formulário estão preenchidos",
      errors: validation.errors,
    };
  }

  // Roles
  /* 
    0 - Useless
    1 - User
    2 - Editor
    3 - Admin
  */

  // Status
  /* 
    0 - Deleted
    1 - Approved
    2 - Analysis
  */

  try {
    const alreadyExists = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (alreadyExists) {
      event.res.statusCode = 403;

      return {
        message: "This email is being used!",
        pt_message: "Esse email já está sendo utilizado!",
        alreadyExists,
      };
    }

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 8),
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return {
      user,
      message: "A new user has been successfully created!",
      token,
      expires_at: moment().add(24, "h"),
    };
  } catch (error) {
    event.res.statusCode = 403;

    return {
      message: "This email is being used!",
      error: error.message,
    };
  }
});
