var nodemailer = require('nodemailer');

const sendEmail = async ({message})=>{
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'receiverftn@gmail.com',
      pass: 'kxgorlnypqeyvgcf',
    },
    secure: true,
  });
  
  const mailData = {
    from: 'receiverftn@gmail.com',
    to: 'sakthilakshmims@gmail.com',
    subject: `Message From`,
    text:message,
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

