import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLeaveStatusEmail = async (to: string, status: string, reason: string) => {
  const mailOptions = {
    from: '"HR System" <hr@test.com>',
    to,
    subject: `Leave Request Update`,
    text: `Your leave request has been ${status}. \nNote from Admin: ${reason}`,
    html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>Leave Request Update</h2>
            <p>Your leave request has been <strong>${status.toUpperCase()}</strong>.</p>
            <p>Reason for decision: ${reason}</p>
          </div>`,
  };

  return await transporter.sendMail(mailOptions);
};