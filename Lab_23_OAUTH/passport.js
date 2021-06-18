const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID:
                '240625381905-mr8bfskcs8aub0to175v4jkufnu4vrsr.apps.googleusercontent.com',
            clientSecret: 'xvmkgB_WB1p1bYgorGt-DJEB',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        },
    ),
);
