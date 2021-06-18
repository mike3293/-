const express = require('express');
const bodyParser = require('body-parser');

const facultyRouter = require('./mvc/Faculty/faculty.route');
const progressRouter = require('./mvc/Progress/progress.route');
const studentRouter = require('./mvc/Student/student.route');

const app = express();

app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/faculties', facultyRouter);
app.use('/api/progress', progressRouter);
app.use('/api/students', studentRouter);

app.use(function (req, res, next) {
    res.status(404).send('Not Found');
});

app.listen(3000);

