require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// background jobs
const Agenda = require('agenda');

const authRoutes = require('./routes/auth');
const noAuthRoutes = require('./routes/noAuth');
const User = require('./models/user');

const app = express();

// defining the collection where background jobs will be saved
const agenda = new Agenda({
    db: {
        address: process.env.MONGODB,

        options: {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
});

agenda.define('deleting users that did not verify their email within 1 hour', async (job) => {
    // first we find all the users
    const users = await User.find();

    // mapping them
    users.map(async user => {
        const userId = user._id;
        let expired;

        // if user doesn't have a token expire date we do NOT delete the account
        if(user.tokenVerifyEmailExpires === undefined) {
            return expired = false;
        };

        // if user has token expire date we check if it passed more than 1 hour and, if so, we remove the account
        if(user.tokenVerifyEmailExpires) {
            expired = Date.now() > user.tokenVerifyEmailExpires;

            if(expired) {
                await User.findByIdAndRemove(userId);
            };
        };
    });
});

agenda.define('deleting notifications that are older than 1 week', async (job) => {
    // first we find all the users
    const users = await User.find();

    // then we analyze them one by one
    users.map(user => {
        // analyzing the notifications
        user.notifications.map(async notification => { 
            // we will use this variable to determinate if a notification is a friend request or not
            let date;

            // so if it is a friend request we set date grater then Date.now() so that we do not remove it
            if(notification.date === undefined) {
                date = Date.now() + 1;
            };

            // if it is not a friend request we set date with the date that there is into the db
            if(notification.date) {
                date = notification.date;
            };

            // if it passes more than 1 week we proceed on remove it
            if(Date.now() > date) {
                let userNotifications = user.notifications;
                const updatedNotifications = userNotifications.filter(noti => { console.log('noti', noti)
                    return Date.now() < noti.date; 
                }); 

                user.notifications = updatedNotifications;
                await user.save();
            };
        });
    });
});

// starting the agenda background jobs
(async function() {
    await agenda.start();
    await agenda.every("5 seconds", "deleting users that did not verify their email within 1 hour");
    await agenda.every("5 seconds", "deleting notifications that are older than 1 week");
})();

// setting up sessions into db
const store = new MongoDBStore({
    uri: process.env.MONGODB,
    collection: 'session',
});

// I am declaring the server like this instead of app.listen otherwise the tests won't work (I'm using supertest and exporting app into another file doesn't work)
// so I came up with this solution (closing the port after each test)
const server = http.createServer(app);

// storing cookies
app.use(cors({ origin: process.env.URL, credentials: true }));

// resave false means that the session won't be saved in every req but only if something changes (default true deprecated)
// saveUnitialized false makes sure that the session won't be saved if nothing changes
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store,
        secret: process.env.SESSION_SECRET,

        cookie: {
            httpOnly: true,
            maxAge: 3600000 * 24, // 24 hours
            secure: false,
        },
    }),
);

// able to parse json data
app.use(bodyParser.json());

// parsing cookies so that we can verify the value
app.use(cookieParser());

// parsing body
app.use(bodyParser.urlencoded({ extended: true }));

// avoiding cors errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');
    res.setHeader('Acces-Control-Allow-Origin', process.env.URL);
    next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api', noAuthRoutes);

// connecting to db
// DeprecationWarning: { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        server.listen(process.env.PORT)
        console.log('connected to db');
    })

    .catch(err => console.log('mongo error: ', err));

module.exports = app;
module.exports = server;