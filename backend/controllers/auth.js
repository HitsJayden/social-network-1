require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");
const { transport } = require("../mail/mail");
const Post = require("../models/post");

exports.signup = async (req, res) => {
  try {
    // getting user inputs
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    const surname = req.body.surname;
    const nickname = req.body.nickname;

    const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;

    if (!email.match(emailRegex)) {
      return res.status(422).json({ message: "Invalid Email" });
    }

    // checking if an user already signed up with this email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(409)
        .json({ message: "User " + email + " Already Exists" });
    }

    // name cannot be empty
    if (name.length === 0) {
      return res.status(422).json({ message: "Please Enter Your Name" });
    }

    // surname cannot be empty
    if (surname.length === 0) {
      return res.status(422).json({ message: "Please Enter Your Surname" });
    }

    // password >= 5
    if (password.length < 5) {
      return res
        .status(422)
        .json({ message: "Password Needs To Be At Least 5 Characters" });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({ message: "Passwords Do Not Match" });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    // creating a token so that we can send it by email to the user and verify the email
    const tokenVerifyEmail = crypto.randomBytes(32).toString("hex");

    // hashing the token and setting expire date of 1 hour, if the user doesn't verify the email within 1 hour account will be deleted
    const hashedTokenVerifyEmail = await bcrypt.hash(tokenVerifyEmail, 12);
    const tokenVerifyEmailExpires = Date.now() + 3600000;

    // creating user
    const user = new User({
      name,
      surname,
      nickname,
      email,
      password: hashedPassword,
      tokenVerifyEmail: hashedTokenVerifyEmail,
      tokenVerifyEmailExpires,
    });

    // saving user into db
    const savedUser = await user.save();

    // encoding the token so that we can send it into the url
    const encodedToken = encodeURIComponent(tokenVerifyEmail);

    const userId = savedUser._id;
    const link =
      process.env.URL + "/auth/verify-account/" + encodedToken + "/" + userId;

    await transport.sendMail({
      from: process.env.USER_MAIL,
      to: savedUser.email,
      subject: "Please Verify Your Account",

      html: `
                <h1>Hi ${savedUser.name},</h1>
                <br>
                <p>Please Click On The Link Below In Order To Verify Your Account</p>
                <br>
                <a href="${link}">Click Here To Verify Your Account</a>
            `,
    });

    return res
      .status(201)
      .json({
        message:
          "User Created, Please Verify Your Account By Checking Your Email Within 1 Hour",
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.verifySignup = async (req, res, next) => {
  try {
    // getting data from URL
    const tokenVerifyEmail = decodeURIComponent(req.params.tokenVerifyEmail);
    const userId = req.params.userId;

    // finding the user so that we can verify token and password
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Sorry, The Account Was Deleted" });
    }

    const tokenIsValid = await bcrypt.compare(
      tokenVerifyEmail,
      user.tokenVerifyEmail
    );

    // verifing the token, if it is not valid account will be removed so that the user can signup again
    if (!tokenIsValid || Date.now() > user.tokenVerifyEmailExpires) {
      await User.findByIdAndRemove(userId);
      return res
        .status(401)
        .json({
          message:
            "Sorry, Something Went Wrong. Please Signup Again, You Are Being Redirected To The Sign Up Page",
        });
    }

    // verifying password
    const password = req.body.password;
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Passwords Do Not Match" });
    }

    // deleting these data from db so that we can delete all the users that have these data for more than 1 hour (background job)
    user.tokenVerifyEmail = undefined;
    user.tokenVerifyEmailExpires = undefined;

    await user.save();
    return res
      .status(200)
      .json({
        message:
          "Thank You For Verifying Your Account, You Are Being Redirected To The Login Page",
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    // getting inputs of the user
    const email = req.body.email;
    const password = req.body.password;

    // finding the user with the email provided
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            "There Is No Account In Our Database With The Following Email: " +
            email,
        });
    }

    // checking if password matches the one that we have in the db
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json({
          message:
            "Invalid Password, Please Try Again Or Request A Reset Password",
        });
    }

    // if user did not verify the email he can't login
    if (user.tokenVerifyEmail) {
      return res
        .status(401)
        .json({ message: "Please Verify Your Account By Checking Your Email" });
    }

    const userId = user._id.toString();

    // signing a token
    const token = jwt.sign(
      {
        email,
        userId,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // for navigation on the client side I use a cookie httpOnly false
    const weakToken = jwt.sign({ userId }, process.env.WEAK_TOKEN_SECRET, {
      expiresIn: "24h",
    });

    // if inputs are correct we authenticate the user by storing a session and storing tokens into cookies
    await User.findById(userId)
      .then(() => {
        // authenticating the user and storing his information into the session
        req.session.isAuth = true;
        req.session.user = user;

        // tokens into cookies and saving the session
        res.cookie("token", token, {
          maxAge: 3600000 * 24,
          httpOnly: true,
          path: "/",
          domain: process.env.DOMAIN,
        });
        res.cookie("authCookie", weakToken, {
          maxAge: 3600000 * 24,
          httpOnly: false,
          path: "/",
          domain: process.env.DOMAIN,
        });
        // I will use the following cookie in order to show a custom message based on if users are friends
        res.cookie("userId", userId, {
          maxAge: 3600000 * 24,
          httpOnly: false,
          path: "/",
          domain: process.env.DOMAIN,
        });
        req.session.save((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    return res
      .status(200)
      .json({
        message: "Successful Login, You Are Being Redirected To The Home",
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.logout = async (req, res, next) => {
  try {
    // deleting session
    req.session.destroy();

    // deleting tokens into cookies
    res.status(200).clearCookie("connect.sid", {
      maxAge: 3600000 * 24,
      httpOnly: true,
      secure: false,
      domain: process.env.DOMAIN,
    });
    res.status(200).clearCookie("authCookie", {
      maxAge: 3600000 * 24,
      httpOnly: false,
      path: "/",
      domain: process.env.DOMAIN,
    });
    res.status(200).clearCookie("token", {
      maxAge: 3600000 * 24,
      httpOnly: true,
      path: "/",
      domain: process.env.DOMAIN,
    });

    res.status(200).clearCookie("userId", {
      maxAge: 3600000 * 24,
      httpOnly: false,
      path: "/",
      domain: process.env.DOMAIN,
    });

    return res.status(200).json();
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.makePost = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res
        .status(401)
        .json({ message: "You Cannot Take This Action, Please Log In" });
    }

    const token = req.cookies.token;
    jwt.verify(token, process.env.TOKEN_SECRET);

    const weakToken = req.cookies.authCookie;
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    const userId = req.session.user._id;
    const user = await User.findById(userId);

    // getting inputs
    const content = req.body.content;
    let image = req.body.image;

    if (content.length === 0) {
      return res.status(422).json({ message: "Post Cannot Be Empty" });
    }

    // if there is no image we set it to undefined so on the client side we won't show the image
    if (image === null) {
      image = undefined;
    }
    console.log(image);

    // creating the post
    const post = new Post({ content, userId, likes: { likes: 0 }, image });
    await post.save();

    // pushing post into user
    user.posts.push({
      content,
      postId: post._id,
    });
    await user.save();

    return res.status(201).json({ message: "Post Created" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    const postId = req.params.postId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const userPosts = user.posts;
    const updatedPosts = userPosts.filter((post) => {
      return post.postId.toString() !== postId.toString();
    });
    user.posts = updatedPosts;
    await user.save();
    await Post.findByIdAndRemove(postId);
    return res.status(200).json({ message: "Post Was Deleted" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.viewPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    const createdAt = post.createdAt;
    const content = post.content;
    const image = post.image;
    const likes = post.likes.likes;

    return res
      .status(200)
      .json({ message: "Post Fetched", createdAt, content, image, likes });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.homePage = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding the user, finding his friends and only showing the posts of his friends
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const userFriends = user.friends.map((friend) => {
      return friend.userId;
    });

    const posts = await Post.find({ userId: userFriends });
    return res.status(200).json({ message: "Posts Fetched", posts });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.like = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "You Need To Log In" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const postId = req.params.postId;
    const post = await Post.findById(postId);

    const likesUsersPosts = post.likes.users.userId;

    // we first find the index of the user id
    const userIndex = likesUsersPosts.findIndex((i) => {
      return i.toString() === userId.toString();
    });

    // so if the index of the user id is >= 0 (that means it exists) we remove the like otherwise we put the like
    if (userIndex >= 0) {
      let updatedUsersIds = post.likes.users.userId.filter((user) => {
        return user.toString() !== userId.toString();
      });

      post.likes.likes = post.likes.likes - 1;
      post.likes.users.userId = updatedUsersIds;
    } else {
      // logic for sending notification to the user (we also put a date o 1 week so that we will remove all the olds notifications with a background job)
      const userPostId = post.userId;
      const userPost = await User.findById(userPostId);

      // if the user that likes the post is the same of the one that created the post we won't send a notification
      if (userPostId.toString() !== userId.toString()) {
        userPost.notifications.push({
          message:
            user.name.slice(0, 12) +
            " Liked Your Post " +
            post.content.slice(0, 8),
          date: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
          postId,
        });
        await userPost.save();
      }

      post.likes = {
        likes: post.likes.likes + 1,
        users: {
          userId,
        },
      };
    }
    await post.save();
    return res.status(200).json();
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.comments = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // getting the input of the user (comment)
    const content = req.body.content;

    // comment cannot be empty
    if (content.length === 0) {
      return res.status(422).json({ message: "Comment Cannot Be Empty" });
    }

    // finding the post
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // assigning user id to the comment
    const userId = req.session.user._id;

    // finding the user so that we can show name, surname and nickname when another user loads the comments
    const user = await User.findById(userId);

    // pushing into post comment
    post.comments.push({
      content,
      userId,
      name: user.name,
      surname: user.surname,
      nickname: user.nickname,
    });

    // if there is no comment we need to assign 0 as value otherwise validation will fail
    if (post.totalComments === undefined) {
      post.totalComments = 0;
    }

    // adding 1 to total comments in order to count all the comments for this post
    post.totalComments += 1;
    await post.save();

    // finding the user that created the post so that we can send him a notification
    const userIdPost = post.userId;
    const userPost = await User.findById(userIdPost);

    console.log(post.userId);
    console.log(userId);

    // if the user that comments is the same user that created the post we won't send a notification
    if (post.userId.toString() !== userId.toString()) {
      userPost.notifications.push({
        message:
          user.name.slice(0, 12) +
          " Commented Your Post " +
          post.content.slice(0, 8),
        date: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        postId,
      });
      await userPost.save();
    }

    return res.status(201).json({ message: "Post Was Commented" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.loadComments = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding posts and sending in res comments and total comments of this post
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    const comments = post.comments;
    let totalComments = post.totalComments;

    if (totalComments === undefined) {
      totalComments = 0;
    }
    return res
      .status(200)
      .json({ message: "Comments Fetched", comments, totalComments });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding post
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // getting userId and commentId so that we can compare them in the next lines
    const userId = req.session.user._id;
    const commentId = req.params.commentId;

    post.comments.map(async (comment) => {
      // if commentIds and userIds match we can delete the comment
      if (
        commentId.toString() === comment._id.toString() &&
        userId.toString() === comment.userId.toString()
      ) {
        const comments = post.comments;

        // getting all the comments apart of the one that we want to delete
        const updatedComments = comments.filter((comment) => {
          return comment._id.toString() !== commentId.toString();
        });

        // updating the comments with the ones that we want to remain, decreasing totalComments and saving
        post.comments = updatedComments;
        post.totalComments -= 1;
        await post.save();
        return res.status(200).json({ message: "Comment Deleted" });
      }
    });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

// profile page that you see as a friend of that user
exports.profilePage = async (req, res, next) => {
  try {
    // getting the user id from params so that we can find all the posts of this user
    const userId = req.params.userId;
    const user = await User.findById(userId);

    // we will send these data so that in the profile page we can fetch all the posts and profile image of this user on the client side
    const userPosts = await Post.find({ userId });
    let profileImage = user.profileImage;
    const name = user.name;
    const surname = user.surname;
    const nickname = user.nickname;
    const friends = user.friends;

    if (!profileImage) {
      profileImage = undefined;
    }

    return res
      .status(200)
      .json({
        message: "Posts Fetched",
        userPosts,
        profileImage,
        name,
        surname,
        nickname,
        friends,
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

// profile page that you see as an "owner"
exports.myProfilePage = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // getting the data that we will show on the client side
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const userPosts = await Post.find({ userId });
    let profileImage = user.profileImage;
    const name = user.name;
    const surname = user.surname;
    const nickname = user.nickname;

    // we will change the profile imaage to undefined so that we don't show an empty image on the client side
    if(!profileImage) {
      profileImage = undefined
    }

    return res
      .status(200)
      .json({
        message: "Data Fetched",
        profileImage,
        userPosts,
        name,
        surname,
        nickname,
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding the user
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    // saving new profile image
    const profileImage = req.body.changeImage;
    user.profileImage = profileImage;
    await user.save();
    return res.status(201).json({ message: "Profile Image Updated" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // so here we find the user that is sending the request from the session
    // the user that is receiving the request from the params
    const userIdSession = req.session.user._id;
    const userSession = await User.findById(userIdSession);
    const userIdParams = req.params.userId;
    const userParams = await User.findById(userIdParams);

    // mapping user session friend requests so that we can see if the user already sent a friend request and, if so, we tell him that
    const friendRequestSent = userSession.friendRequestSent;
    let alreadySent;

    friendRequestSent.map((user) => {
      if (user.userId.toString() === userIdParams.toString()) {
        return (alreadySent = true);
      }
      return (alreadySent = false);
    });

    if (alreadySent) {
      return res
        .status(401)
        .json({ message: "Friend Request Already Sent To " + userParams.name });
    }

    // updating db with ids of users that received and sent the request and sending notification to the right user
    userSession.friendRequestSent.push({ userId: userIdParams });
    await userSession.save();

    userParams.friendRequestReceived.push({ userId: userIdSession });

    // here we don't set a date to the notification because we will remove it only if the user accept or decline the friend request
    userParams.notifications.push({
      message: userSession.name + " Sent You A Friend Request",
      date: undefined,
      userId: userIdSession,
    });

    await userParams.save();
    return res.status(201).json({ message: "Friend Request Sent" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // getting the notifications of the user and sending them on the client side
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const notifications = user.notifications;

    return res
      .status(200)
      .json({ message: "Notifications Fetched", notifications });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding the 2 users
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const userIdParams = req.params.userId;
    const userParams = await User.findById(userIdParams);

    // updating the friend request received (userParams is the one who sent the friend request) and friends list
    const userFriendRequestReceived = user.friendRequestReceived;
    const friendRequestReceivedUpdated = userFriendRequestReceived.filter(
      (i) => {
        return i.userId.toString() !== userIdParams.toString();
      }
    );

    user.friendRequestReceived = friendRequestReceivedUpdated;
    user.friends.push({ userId: userIdParams });
    await user.save();

    // updating friend request sent (user is the one that is accepting the friend request) and friends list
    const userFriendRequestSent = userParams.friendRequestSent;
    const friendRequestSentUpdated = userFriendRequestSent.filter((i) => {
      return i.userId.toString() !== userId.toString();
    });

    userParams.friendRequestSent = friendRequestSentUpdated;
    userParams.friends.push({ userId });
    // sending a notification to the user that says that the friend request was accepted
    userParams.notifications.push({
      userId,
      message: user.name + " Accepted Your Friend Request",
      date: Date.now() + 1000 * 60 * 60 * 7,
    });
    await userParams.save();

    // mapping the notifications so that we can delete it once the request is accepted
    // (and so we avoid to push the same friend over and over if the user clicks more times on accept)
    user.notifications.map(async (notification) => {
      // here we check if it is a friend request
      if (notification.message.includes("Sent You A Friend Request")) {
        // here we delete it by comparing the users ids
        if (userIdParams.toString() === notification.userId.toString()) {
          const notifications = user.notifications;
          const updatedNotifications = notifications.filter((noti) => {
            return noti.userId.toString() !== userIdParams.toString();
          });
          console.log(updatedNotifications);
          user.notifications = updatedNotifications;
          await user.save();
        }
      }
    });
    return res
      .status(201)
      .json({
        message: "You Accepted " + userParams.name + "'s Friend Request",
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.declineFriendRequest = async (req, res, next) => {
  try {
    // checking if the user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    // finding the 2 users
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const userIdParams = req.params.userId;
    const userParams = await User.findById(userIdParams);

    // here we update the requests that this user received
    const userFriendRequestReceived = user.friendRequestReceived;
    const updatedFriendRequestReceived = userFriendRequestReceived.filter(
      (reqReceived) => {
        return reqReceived.userId.toString() !== userIdParams.toString();
      }
    );

    user.friendRequestReceived = updatedFriendRequestReceived;
    await user.save();

    // here we update the requests that the userParam sent
    const userParamsRequestSent = userParams.friendRequestSent;
    const updatedFriendRequestSent = userParamsRequestSent.filter((reqSent) => {
      return reqSent.userId.toString() !== userId.toString();
    });

    userParams.friendRequestSent = updatedFriendRequestSent;
    await userParams.save();

    // mapping the notifications so that we can delete it once the request is declined
    user.notifications.map(async (notification) => {
      // here we check if it is a friend request
      if (notification.message.includes("Sent You A Friend Request")) {
        // here we delete it by comparing the users ids
        if (userIdParams.toString() === notification.userId.toString()) {
          const notifications = user.notifications;
          const updatedNotifications = notifications.filter((noti) => {
            return noti.userId.toString() !== userIdParams.toString();
          });
          user.notifications = updatedNotifications;
          await user.save();
        }
      }
    });

    return res
      .status(200)
      .json({
        message: "You Declined " + userParams.name + "'s Friend Request",
      });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.settings = async (req, res, next) => {
  try {
    // checking if user is logged in
    if (!req.session.isAuth) {
      return res.status(401).json({ message: "Login Is Needed" });
    }

    const token = req.cookies.token;
    const weakToken = req.cookies.authCookie;

    jwt.verify(token, process.env.TOKEN_SECRET);
    jwt.verify(weakToken, process.env.WEAK_TOKEN_SECRET);

    const userId = req.session.user._id;
    const user = await User.findById(userId);

    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let newPassword = req.body.newPassword;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;

    if (email === "") {
      email = user.email;
    }

    if (email !== user.email) {
      if (!email.match(emailRegex)) {
        return res.status(422).json({ message: "Invalid Email" });
      }

      // checking if an user already signed up with this email
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res
          .status(409)
          .json({ message: "User " + email + " Already Exists" });
      }
    }

    if (name === "") {
      name = user.name;
    }

    if (surname === "") {
      surname = user.surname;
    }

    if (nickname === "") {
      nickname = user.nickname;
    }

    if (
      newPassword.length < 5 &&
      newPassword !== "" &&
      confirmPassword !== ""
    ) {
      return res
        .status(422)
        .json({ message: "Password Needs To Be At Least 5 Characters" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(403).json({ message: "Passwords Do Not Match" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json({
          message:
            "Password Is Wrong, Please Confirm Your Password In Order To Change Details",
        });
    }

    // changing details
    user.email = email;
    user.name = name;
    user.surname = surname;
    user.nickname = nickname;

    if (newPassword !== "" && confirmPassword !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    await user.save();
    return res.status(200).json({ message: "Details Changed!" });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);

    if(!err.statusCode) {
      err.statusCode = 500;
    }
  }
}