import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'bdsmartleadexchanger@gmail.com',
      pass: 'jlwl kgpe tyvn mytn',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: '"BdSmartLeadExchanger" <bdsmartleadexchanger@gmail.com>',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};
