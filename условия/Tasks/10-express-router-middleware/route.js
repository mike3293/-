const express = require("express");
const app = express();

const router1 = express.Router();
const router2 = express.Router();

app.use("/router1", router1);
app.use("/router2", router2);

router1.get("/a", (req, res) => {
    res.send('router1');
});

router2.get("/a", (req, res) => {
    res.send('router2');
});

app.listen(3000, () => {
    console.log("http://localhost:3000/")
});
