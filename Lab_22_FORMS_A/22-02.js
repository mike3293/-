const UserService = require('./Services/UsersServices');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('./jwt');
const config = require('./config');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

const app = express();
app.use(cookieParser());
app.get('/login', (req, res) => {
    console.log(req.cookies);
    res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/Register.html');
});

app.post('/login', urlencodedParser, async (req, res) => {
    console.log(req.cookies);
    console.log(req.body);
    let resultFind = await UserService.FindByUsername({
        username: req.body.username,
    });
    if (resultFind.length === 0)
        res.redirect('/login');
    if (bcrypt.compareSync(resultFind[0]['password'], req.body.password))
        res.redirect('/login');
    else {
        res.cookie(
            config.jwt.tokens.refresh.type,
            jwt.generateRefreshToken(req.body.username),
            config.refreshOptions,
        );
        res.cookie(
            config.jwt.tokens.access.type,
            jwt.generateAccessToken(req.body.username),
            config.accessOptions,
        );
        res.redirect('/resource');
    }
});

app.get('/resource', jwt.CheckJwt, (req, res) => {
    res.send(
        `resource, username: ${req.body[0]['username']}`,
    );
});

app.post('/Register', urlencodedParser, async (req, res) => {
    try {
        await UserService.AddUsers({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, salt),
        });
        return res.redirect('/login');
    } catch (e) {
        console.log(e);
        return res.sendStatus(404);
    }
});
app.get('/logout', (req, res) => {
    res.clearCookie(config.jwt.tokens.refresh.type);
    res.clearCookie(config.jwt.tokens.access.type);
    res.redirect('/login');
});

app.get('/refresh-token', jwt.CheckJwtRefresh, (req, res) => {
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

app.use(function (request, response) {
    response.sendStatus(404);
});

sequelize.sync().then((res) => {
    app.listen(3000, () => {
        console.log('run on 3000');
    });
});
