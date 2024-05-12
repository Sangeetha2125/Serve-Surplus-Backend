var nodemailer = require('nodemailer');

const sendEmail = async (message,receiver)=>{
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'receiverftn@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });
  
  const mailData = {
    from: 'receiverftn@gmail.com',
    to: receiver,
    subject: `Message From Serve Surplus`,
    html:message,
  };
  
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });

}

module.exports = sendEmail;

