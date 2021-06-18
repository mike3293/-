const express = require("express");
const app = express();

const router = express.Router();

app.use((req, res, next) => {
    console.log(req.path);
    next();
});
app.use("/router", router);

router.get("/a", (req, res) => {
    res.send('router');
});

app.listen(3000, () => {
    console.log("http://localhost:3000/")
});
