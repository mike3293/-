const express = require("express");
const app = express();

//.query объект, содержащий все параметры запроса

app.get("/user", (req, res) => {
    res.send("My name is " + req.query.name);
});

app.get("/contact", (req, res) => {
    res.send("Name: " + req.query["name"] + ", phone: " + req.query["phone"]);
});

app.listen(3000, () => {
    console.log("http://localhost:3000/user?name=Anna");
});
