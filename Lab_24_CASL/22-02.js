const UserService = require('./Services/UsersServices');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('./jwt');
const jwtToken = require('jsonwebtoken');
const config = require('./config');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const userRouter = require('./Router/user.route');
const reposRouter = require('./Router/repos.route');
const expressjwt = require('express-jwt');
const createAbilities = require('./middlewars/defineAbility');
const { secret, tokens } = require('./config').jwt;
const Role = require('./models/Role');
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: (req) => {
        const cookie = req.headers.cookie || '';
        const cArray = cookie.split('; ');
        const token = cArray.find(c => c.indexOf('access') !== -1);
        if (token) {
            return token.replace('access=', '');
        }
        console.log('express jwt');
        let GUEST_TOKEN = jwtToken.sign({ role: Role.Guest }, secret);
        console.log(GUEST_TOKEN);

        return GUEST_TOKEN;
    },
}));
app.use(createAbilities);

app.use('/api/user', userRouter);
app.use('/api/repos', ((req, res, next) => {
    console.log(req.ability.rules);
    if (req.ability.can('read', 'Repos')) {
        next();
    } else {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
}), reposRouter);

app.get('/ability', ((req, res) => {
    console.log('here');
    res.send(req.ability.rules);
}));

app.get('/login', (req, res) => {
    console.log(req.cookies);
    res.sendFile(__dirname + '/login.html');
});

app.get('/Register', (req, res) => {
    res.sendFile(__dirname + '/Register.html');
});

app.post('/login', urlencodedParser, async (req, res) => {
    let resultFind = await UserService.FindByUsername({
        username: req.body.username,
    });
    console.log(resultFind.length);
    if (resultFind.length === 0)
        return res.redirect('/login');
    if (bcrypt.compareSync(resultFind[0]['password'], req.body.password))
        return res.redirect('/login');
    else {
        res.cookie(
            config.jwt.tokens.refresh.type,
            jwt.generateRefreshToken(req.body.username, resultFind[0].role),
            config.refreshOptions,
        );
        res.cookie(
            config.jwt.tokens.access.type,
            jwt.generateAccessToken(req.body.username, resultFind[0].role, resultFind[0].id),
            config.accessOptions,
        );
        return res.redirect('/resource');
    }
});

app.get('/resource', jwt.CheckJwt, (req, res) => {
    res.send(
        ` resource  username =  ${req.body[0]['username']}  age =  ${req.body[0]['age']}`,
    );
});

app.post('/Register', urlencodedParser, async (req, res) => {
    try {
        console.log('here');
        await UserService.AddUsers({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, salt),
            age: req.body.age,
        });
        return res.redirect('/login');
    } catch (e) {
        console.log(e);
        return res.sendStatus(404);
    }
});

app.get('/logout', (req, res) => {
    res.cookie(config.jwt.tokens.refresh.type, {}, { expires: new Date(Date.now()), maxAge: 0, path: '/refresh-token' });
    res.cookie(config.jwt.tokens.access.type, {}, { expires: new Date(Date.now()), maxAge: 0 });
    res.clearCookie(config.jwt.tokens.refresh.type);
    res.clearCookie(config.jwt.tokens.access.type);
    res.redirect('/login');
});

app.get('/refresh-token', jwt.CheckJwtRefresh, (req, res) => {
    res.cookie(config.jwt.tokens.refresh.type, {}, { expires: new Date(Date.now()), maxAge: 0 });
    res.cookie(config.jwt.tokens.access.type, {}, { expires: new Date(Date.now()), maxAge: 0 });
    res.clearCookie(config.jwt.tokens.refresh.type);
    res.clearCookie(config.jwt.tokens.access.type);
    res.cookie(
        config.jwt.tokens.refresh.type,
        jwt.generateRefreshToken(req.body[0]['username']),
        config.refreshOptions,
    );
    res.cookie(
        config.jwt.tokens.access.type,
        jwt.generateAccessToken(req.body[0]['username']),
        config.accessOptions,
    );
    res.redirect('/resource');
});

app.use(function (err, request, response, next) {
    console.log(err);
    return response.sendStatus(404).send(err);
});

sequelize.sync({ alter: true }).then((res) => {
    app.listen(3000, () => {
        console.log('run on 3000');
    });
});
