require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: 'sorrentino.mauro95@gmail.com',
        pass: 'NuovaSuperContrasena95!',
    },
});

exports.transport = transport;