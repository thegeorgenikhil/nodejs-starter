import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_LOGIN_MAIL;
const emailPass = process.env.EMAIL_LOGIN_PASS;

const transporter = nodemailer.createTransport({
  service: "SendinBlue",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const sendVerificationEmail = async (
  name: string,
  email: string,
  slug: string,
  verificationId: string
) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Verify your account",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
    </head>
    <body>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h2>Verify Your Account</h2>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 0 20px;">
                    <p>Hello ${name},</p>
                    <p>Thank you for signing up with us. To activate your account, please click the link below:</p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/${slug}/${verificationId}" style="text-decoration: none; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px; display: inline-block;">Verify Account</a>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 0 20px;">
                    <p>If the button above does not work, you can also click the link below or copy and paste it into your browser:</p>
                    <p><a href="${process.env.FRONTEND_URL}/${slug}/${verificationId}">${process.env.FRONTEND_URL}/${slug}/${verificationId}</a></p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <p>If you have any questions or need assistance, please contact our support team at ${process.env.SUPPORT_EMAIL}.</p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <p>Thank you for choosing us!</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  slug: string,
  verificationId: string
) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Reset your password",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h2>Password Reset</h2>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 0 20px;">
                    <p>Hello ${name},</p>
                    <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                    <p>If you did request a password reset, please click the link below or use the button to reset your password:</p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/${slug}/${verificationId}" style="text-decoration: none; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 0 20px;">
                    <p>If the button above does not work, you can also click the link below or copy and paste it into your browser:</p>
                    <p><a href="${process.env.FRONTEND_URL}/${slug}/${verificationId}">${process.env.FRONTEND_URL}/${slug}/${verificationId}</a></p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <p>If you have any questions or need further assistance, please contact our support team at ${process.env.SUPPORT_EMAIL}.</p>
                </td>
            </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <p>Thank you for using our service!</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
