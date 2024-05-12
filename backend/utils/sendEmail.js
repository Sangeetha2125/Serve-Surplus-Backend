var nodemailer = require('nodemailer');

const sendEmail = async ({})=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'receiverftn@gmail.com',
      pass: 'kxgorlnypqeyvgcf'
    }
  });
  
  var mailOptions = {
    from: 'receiverftn@gmail.com',
    to: 'sakthilakshmims@gmail.com',
    subject: 'Sending Email using Node.js',
    text: "hello"
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail;