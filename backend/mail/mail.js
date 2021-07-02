require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL,
    },
});

exports.transport = transport;