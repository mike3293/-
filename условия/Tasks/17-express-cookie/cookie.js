const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

let myId = 0;

app.get('/', (req, res) => {
    ++myId;
    res.cookie('myId', myId).send('Cookie');
});

app.get('/cookie', (req, res) => {
    let myId = req.headers.cookie.split('; ');
    res.send(myId[1]);
});

app.listen(3000, () => {
    console.log("http://localhost:3000/")
});

