import nodemailer from 'nodemailer';

const sendEmail = async (name, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Platform!',
      text: `Hi ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest Regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome ');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
