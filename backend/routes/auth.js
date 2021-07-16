const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.put('/signup', authController.signup);
router.patch('/verify-account/:tokenVerifyEmail/:userId', authController.verifySignup);

router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.put('/create-post', authController.makePost);
router.delete('/delete-post/:postId', authController.deletePost);
router.get('/view-post/:postId', authController.viewPost);
router.get('/home-page', authController.homePage);

router.patch('/like/:postId', authController.like);
router.put('/comment/:postId', authController.comments);
router.get('/load-comments/:postId', authController.loadComments);
router.delete('/delete-comment/:commentId/:postId', authController.removeComment);

router.get('/my-profile', authController.myProfilePage);
router.get('/load-profile/:userId', authController.profilePage);
router.patch('/load-profile-image', authController.updateProfileImage);

router.put('/send-friend-request/:userId', authController.sendFriendRequest);
router.patch('/accept-friend/:userId', authController.acceptFriendRequest);
router.patch('/decline-friend/:userId', authController.declineFriendRequest);

router.get('/notifications', authController.getNotifications);
router.patch('/settings', authController.settings);

module.exports = router;