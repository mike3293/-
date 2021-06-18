const express = require("express");
const app = express();

const router = express.Router();
const router1 = express.Router();

app.use("/router", router);
app.use("/router1", router1);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Something broke!');
});

router1.get("/a", (req, res) => {
    throw new Error("Error");
});

router.get("/a", (req, res) => {
    res.send('router');
});

app.listen(3000, () => {
    console.log("http://localhost:3000/")
});
