const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const sender = 'internships.manager@gmail.com';
const receiver = 'misha5555573@gmail.com';

module.exports.send = function (message) {
    let password = 'Dontstealitpls';
    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: sender,
            pass: password
        }
    }));

    let mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Lab_6',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sand');
        }
    })
};
