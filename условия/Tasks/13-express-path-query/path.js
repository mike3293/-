const express = require("express");
const app = express();

//.params параметры запроса в роуте

app.get("/user/:name", (req, res) => {
    res.send("My name is " + req.params.name);
});

app.get("/contact/:name/:phone", (req, res) => {
    res.send("Name: " + req.params["name"] + ", phone: " + req.params["phone"]);
});

app.listen(3000, () => {
    console.log("http://localhost:3000/user/Anna");
});
