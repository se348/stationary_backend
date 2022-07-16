var nodemailer = require('nodemailer')
var config = require('config')
function sendMail(subject,to, mail){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.get("Email"),
          pass: config.get("Pass")
        }
      });
      //"tvybfokhxiwngsjn"
      var mailOptions = {
        from: config.get("Email"),
        to: to,
        subject: subject,
        html: mail
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
}

module.exports = sendMail