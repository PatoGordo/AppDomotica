import jwt from "jsonwebtoken";
import { validateForm } from "js-laravel-validation";
import { prismaClient } from "~~/server/db-client";
import { transporter } from "~~/server/services/mail";

export default defineEventHandler(async (event) => {
  const { email } = await useBody(event);

  const validation = validateForm({
    formData: {
      email: {
        value: email,
        validation: "required|email",
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

  if (!user || user.status === 0 || user.status === 2) {
    event.res.statusCode = 403;

    return {
      message: "This user does not exists in our database or it was deleted!",
    };
  }

  const recoverToken = jwt.sign(
    {
      email: user.email,
      passwordHash: user.password,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  await transporter.sendMail({
    to: email,
    from: process.env.MAIL_USERNAME,
    subject: process.env.APP_NAME + " - Reset password",
    html: `
      <h2>Click in the link below to reset your password</h2>
      <p>The link below expires in 1 one hour</p>
      <br />
      <a href="${process.env.APP_URL}/auth/${recoverToken}/reset-password">Reset password</a>
    `.trim(),
  });

  return {
    message: "An email with a reset link was sent to your mail!",
  };
});
