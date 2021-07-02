require('dotenv').config();
const User = require('../models/user');
const { transport } = require('../mail/mail');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.requestResetPassword = async (req, res, next) => {
    try {
        // getting email of the user and finding it
        const email = req.body.email;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({ message: 'Sorry, We Could Not Find An Account With The Following Email: ' + email });
        };

        // if user has session and cookies still valid we delete all of them
        res.clearCookie('connect.sid');
        res.clearCookie('authCookie');
        res.clearCookie('token');
        req.session.destroy();

        // creating new token for this user
        // creating hashed token with 1 hour expire date so that we can store it into the db for this user
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = await bcrypt.hash(resetToken, 12);
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        // assigning hashed token and expire date into the db for this user
        user.resetToken = hashedResetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        // encoding the user in order to avoid 404 pages if token has / inside
        const encodedToken = encodeURIComponent(resetToken);
        // we also send the user id into the link so that once the user clicks on this link we can find this user
        const link = process.env.URL + '/reset-password-form/' + encodedToken + '/' + user._id;

        // sending email with token in order to change password
        await transport.sendMail({
            from: process.env.USER_MAIL,
            to: user.email,
            subject: 'Reset Password Requested',
            html:
            `
            <h1>Hi ${user.name},</h1>
            <br>
            <p>Please Click On The Link Below In Order To Update Your Password</p>
            <br>
            <a href="${link}">Click Here To Reset Your Password</a>
            `,
        });

        return res.status(200).json({ message: 'Password Reset Requested, Please Check Your Email' });

    } catch (err) {
        console.log(err);

        if(!err.statusCode) {
            err.statusCode = 500;
        };
    };
};

exports.resetPasswordPage = async (req, res, next) => {
    try {
        // decoding the token of the user and finding it by id into url
        const resetToken = decodeURIComponent(req.params.resetToken);
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ message: 'Sorry, We Could Not Find An Account, Please Request Another Password Reset. You Are Being Redirected To The Page' });
        };

        // checking if the user has a valid token
        const isValid = await bcrypt.compare(resetToken, user.resetToken);

        // token not valid or it expired
        if(!isValid || Date.now() > user.resetTokenExpires) {
            return res.status(401).json({ message: 'Forbidden! Please Request Another Password Reset, You Are Being Redirected To The page' });
        };

        // getting inputs of the user
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        // validation password.length >= 5
        if(password.length < 5) {
            return res.status(422).json({ message: 'Password Needs To Be At Least 5 characters' });
        };

        if(password !== confirmPassword) {
            return res.status(422).json({ message: 'Passwords Do Not Match!' });
        };

        // hashing the new password and saving it into the db for this user
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'You Have Changed Your Password, You Are Being Redirected To The Login Page' });

    } catch (err) {
        console.log(err);

        if(!err.statusCode) {
            err.statusCode = 500;
        };
    };
};