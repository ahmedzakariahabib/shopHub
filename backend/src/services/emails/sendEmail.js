import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { emailTemplate } from "./emailTemplate.js";

export const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  let token = jwt.sign({ email }, "myNameIsAhmed");

  const info = await transporter.sendMail({
    from: '"ahmed" <ahmadzakr450@gmail.com>',
    to: email,
    subject: "Hello ✔",
    html: emailTemplate(token),
  });

  console.log("Message sent:", info.messageId);
};
