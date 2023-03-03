import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
// export const sendMail = async () => {
export async function sendMail(to: string, text: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();
//   console.log("testAccount:", testAccount);

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: 'hkcaehxnnehilpzf@ethereal.email', //testAccount.user, // generated ethereal user
  //     pass: 'Py3YbfXZc3e48zBUWh', //testAccount.pass, // generated ethereal password
  //   },
  // });

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '26fb58dcf2f3af', //testAccount.user, // generated ethereal user
      pass: '1a539e17ef78bb', //testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Chris Eastway" <chris.eastway@yahoo.com>', // sender address
    to: to, // list of receivers
    subject: "Change PW", // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}