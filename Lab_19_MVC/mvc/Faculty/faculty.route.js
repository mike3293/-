const express = require('express');
const facultyController = require('./faculty.controller');
const router = express.Router();

router.get('/', facultyController.getAll);
router.post('/', facultyController.create);
router.put('/', facultyController.update);
router.delete('/:faculty', facultyController.delete);

module.exports = router;
