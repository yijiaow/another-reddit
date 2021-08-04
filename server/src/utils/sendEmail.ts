import nodemailer from 'nodemailer';

export const sendEmail = async (
  sender: string,
  receiver: string,
  contentAsHTML: string
) => {
  // const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'jvbljghqewtgrzu6@ethereal.email', // generated ethereal user
      pass: 'FRfS1JNCD225xAP9j5', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info;
  try {
    info = await transporter.sendMail({
      from: sender, // sender address
      to: receiver, // list of receivers
      subject: 'Reset Password', // Subject line
      html: contentAsHTML,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error(err);
  }
};
