const express = require("express");
const app = express();

const router = express.Router();
const router1 = express.Router();

router.use((req, res, next) => {
    console.log(req.path);
    next();
});
app.use("/router", router);
app.use("/router1", router1);


router1.get("/a", (req, res) => {
    res.send('router1');
});

router.get("/a", (req, res) => {
    res.send('router');
});

app.listen(3000, () => {
    console.log("http://localhost:3000/")
});
