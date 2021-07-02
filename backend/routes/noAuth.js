const express = require('express');
const router = express.Router();

const noAuthController = require('../controllers/noAuth');

router.patch('/reset-password', noAuthController.requestResetPassword);
router.patch('/reset-password-form/:resetToken/:userId', noAuthController.resetPasswordPage);

module.exports = router;