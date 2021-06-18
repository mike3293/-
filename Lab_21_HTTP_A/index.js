const app = require('express')();
const passport = require('passport');
const Basic = require('passport-http').BasicStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'mke',
});

let Users = require(__dirname + '/users.json');
const PORT = 3000;
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Basic((user, pass, done) => {
    console.log('passport middlerware');
    let credential = Credential(user);
    if (!credential) {
        console.log('Wrong user name');
        return done(null, false, { message: 'Wrong user name' });
    } else if (!verificate(credential.password, pass)) {
        console.log('Wrong user password');
        return done(null, false, { message: 'Wrong user password' });
    } else {
        return done(null, user, { message: 'All ok' });
    }
}));

passport.serializeUser((user, done) => {
    console.log(user);
    console.log('SerializeUser');
    done(null, user);
});
passport.deserializeUser((user, done) => {
    console.log(user);
    console.log('DeserializeUser');
    done(null, user);
});

app.get(
    '/login',
    (req, res, next) => {
        console.log('Login');
        console.log(req.session);
        if (req.session.logout && req.headers['authorization']) {
            console.log(req.headers['authorization']);
            req.session.logout = false;
            delete req.headers['authorization'];
        }
        next();
    },
    passport.authenticate('basic'), (req, res, next) => {
        if (!req.session.logout)
            req.session.logout = false;
        next();
    }).get('/login', (req, res, next) => {
        res.end('auth done');
    },
);

app.get('/logout', (req, res) => {
    console.log('Logout');
    req.session.logout = true;
    delete req.headers['authorization'];
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    console.log('Resource');
    if (req.session.logout === false && req.headers['authorization'])
        res.end('res');
    else
        res.redirect('/login');
});

let Credential = (user) => {
    const findedUser = Users.find(u => u.user.toLowerCase() === user.toLowerCase());

    return findedUser;
};
let verificate = (pass1, pass2) => {
    return pass1 === pass2;
};

app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    })
    .on('error', (e) => {
        console.log(`Listener | error: ${e.code}`);
    });
