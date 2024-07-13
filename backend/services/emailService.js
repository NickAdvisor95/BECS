//this module is used for send emails
const nodemailer = require("nodemailer");

//create transport for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bbecs9452@gmail.com", //email address from which letters will be sent.
    pass: "BecsDroch95!",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "bbecs9452@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendEmail,
};
