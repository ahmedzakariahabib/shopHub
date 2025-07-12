export const emailTemplate = (token) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Confirm Your Email</h2>
        <p style="font-size: 16px; color: #555;">
          Please click the button below to confirm your email address.
        </p>
        <a href="http://localhost:3000/verify/${token}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Confirm Email
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
};
