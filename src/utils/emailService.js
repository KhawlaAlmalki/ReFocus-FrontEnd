// src/utils/emailService.js
import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  // For production, use real SMTP service (Gmail, SendGrid, etc.)

  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_HOST) {
    // Production configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development configuration (console logging)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASSWORD || 'test',
      },
    });
  }
};

// Send verification email
export const sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;

    const mailOptions = {
      from: `"ReFocus Team" <${process.env.EMAIL_FROM || 'noreply@refocus.com'}>`,
      to: email,
      subject: 'Verify Your Email - ReFocus',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Welcome to ReFocus!</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Hi <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Thank you for registering with ReFocus! We're excited to have you on board.
                      </p>

                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        To complete your registration and start using your account, please verify your email address by clicking the button below:
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${verificationUrl}"
                               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        Or copy and paste this link into your browser:
                      </p>

                      <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #667eea; word-break: break-all;">
                        ${verificationUrl}
                      </p>

                      <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        <strong>Note:</strong> This verification link will expire in 24 hours.
                      </p>

                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        If you didn't create an account with ReFocus, please ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                        � ${new Date().getFullYear()} ReFocus. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        This is an automated email, please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Hi ${name},

        Thank you for registering with ReFocus!

        To complete your registration, please verify your email address by clicking the link below:
        ${verificationUrl}

        This link will expire in 24 hours.

        If you didn't create an account with ReFocus, please ignore this email.

        � ${new Date().getFullYear()} ReFocus. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Verification email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email (after verification)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ReFocus Team" <${process.env.EMAIL_FROM || 'noreply@refocus.com'}>`,
      to: email,
      subject: 'Welcome to ReFocus!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to ReFocus</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #667eea; text-align: center;">Welcome to ReFocus!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hi ${name},
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your email has been verified successfully! You're all set to start using ReFocus.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Get started by setting your goals and tracking your focus sessions.
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br>
              The ReFocus Team
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${name},\n\nYour email has been verified successfully! You're all set to start using ReFocus.\n\nBest regards,\nThe ReFocus Team`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email, it's not critical
    return { success: false, error: error.message };
  }
};

// Send coach application approval email
export const sendCoachApprovalEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

    const mailOptions = {
      from: `"ReFocus Team" <${process.env.EMAIL_FROM || 'noreply@refocus.com'}>`,
      to: email,
      subject: 'Congratulations! Your Coach Application Has Been Approved',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Coach Application Approved</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🎉 Congratulations!</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Hi <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Great news! Your application to become a ReFocus coach has been <strong style="color: #10b981;">approved</strong>!
                      </p>

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        You can now access your coach profile and start helping mentees achieve their focus and productivity goals.
                      </p>

                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Click the button below to log in and complete your coach profile:
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${loginUrl}"
                               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                              Access Your Coach Profile
                            </a>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #065f46;">
                          Next Steps:
                        </p>
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #333333;">
                          <li>Complete your public coach profile</li>
                          <li>Set your availability and max mentees</li>
                          <li>Make your profile publicly visible</li>
                          <li>Start accepting mentee requests</li>
                        </ul>
                      </div>

                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        If you have any questions, feel free to reach out to our support team.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                        © ${new Date().getFullYear()} ReFocus. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        This is an automated email, please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Hi ${name},

        Congratulations! Your application to become a ReFocus coach has been approved!

        You can now access your coach profile and start helping mentees achieve their focus and productivity goals.

        Next Steps:
        - Complete your public coach profile
        - Set your availability and max mentees
        - Make your profile publicly visible
        - Start accepting mentee requests

        Log in here: ${loginUrl}

        If you have any questions, feel free to reach out to our support team.

        © ${new Date().getFullYear()} ReFocus. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Coach approval email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('Error sending coach approval email:', error);
    throw new Error('Failed to send coach approval email');
  }
};

// Send coach application rejection email
export const sendCoachRejectionEmail = async (email, name, rejectionReason) => {
  try {
    const transporter = createTransporter();

    const contactUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact`;

    const mailOptions = {
      from: `"ReFocus Team" <${process.env.EMAIL_FROM || 'noreply@refocus.com'}>`,
      to: email,
      subject: 'Update on Your Coach Application',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Coach Application Update</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Coach Application Update</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Hi <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Thank you for your interest in becoming a coach on ReFocus. We appreciate the time and effort you put into your application.
                      </p>

                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        After careful review, we are unable to approve your application at this time.
                      </p>

                      ${rejectionReason ? `
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #92400e;">
                          Reason:
                        </p>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;">
                          ${rejectionReason}
                        </p>
                      </div>
                      ` : ''}

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        We encourage you to address the feedback and reapply in the future. You're welcome to contact us if you have any questions or need clarification.
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${contactUrl}"
                               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                              Contact Support
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        Thank you for your understanding, and we hope to see you apply again soon.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                        © ${new Date().getFullYear()} ReFocus. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        This is an automated email, please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Hi ${name},

        Thank you for your interest in becoming a coach on ReFocus. We appreciate the time and effort you put into your application.

        After careful review, we are unable to approve your application at this time.

        ${rejectionReason ? `Reason: ${rejectionReason}\n` : ''}

        We encourage you to address the feedback and reapply in the future. You're welcome to contact us if you have any questions or need clarification.

        Thank you for your understanding, and we hope to see you apply again soon.

        © ${new Date().getFullYear()} ReFocus. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Coach rejection email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('Error sending coach rejection email:', error);
    throw new Error('Failed to send coach rejection email');
  }
};

// Send password reset notification email (when admin resets user password)
export const sendPasswordResetNotification = async (email, name, tempPassword) => {
  try {
    const transporter = createTransporter();

    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

    const mailOptions = {
      from: `"ReFocus Team" <${process.env.EMAIL_FROM || 'noreply@refocus.com'}>`,
      to: email,
      subject: 'Your Password Has Been Reset - ReFocus',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Password Reset</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Hi <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        An administrator has reset your password on ReFocus.
                      </p>

                      ${tempPassword ? `
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #92400e;">
                          Temporary Password:
                        </p>
                        <p style="margin: 0; font-size: 18px; font-family: monospace; color: #333333; background-color: #ffffff; padding: 10px; border-radius: 4px;">
                          ${tempPassword}
                        </p>
                      </div>

                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Please log in using this temporary password and <strong>change it immediately</strong> for security.
                      </p>
                      ` : `
                      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                        Your password has been updated. Please contact support if you did not request this change.
                      </p>
                      `}

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${loginUrl}"
                               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                              Log In Now
                            </a>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                          <strong>Security Notice:</strong> If you did not request this password reset, please contact our support team immediately.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                        © ${new Date().getFullYear()} ReFocus. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        This is an automated email, please do not reply.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Hi ${name},

        An administrator has reset your password on ReFocus.

        ${tempPassword ? `Temporary Password: ${tempPassword}\n\nPlease log in using this temporary password and change it immediately for security.` : 'Your password has been updated. Please contact support if you did not request this change.'}

        Log in here: ${loginUrl}

        Security Notice: If you did not request this password reset, please contact our support team immediately.

        © ${new Date().getFullYear()} ReFocus. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Password reset notification sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('Error sending password reset notification:', error);
    throw new Error('Failed to send password reset notification');
  }
};

export default {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendCoachApprovalEmail,
  sendCoachRejectionEmail,
  sendPasswordResetNotification
};
