const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. setup
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: "julioeleven3@gmail.com",
      pass: "sraibdkwnwrdfied", // wmvdsrmruzppelcr
    },
  });

  // 2. Options- to who, from , subject, message
  const mailOptions = {
    from: "natours",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(mailOptions);

  // 3. send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
