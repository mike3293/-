const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/login', (req, res) => {
    console.log(req.body)
    res.send("Hello, " + req.body.Name);
});

app.listen(3000, () => {
    console.log("http://localhost:3000/login")
});
