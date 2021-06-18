const express = require('express');
const studentController = require('./student.controller');
const router = express.Router();

router.get('/', studentController.getAll);
router.post('/', studentController.create);
router.put('/', studentController.update);
router.delete('/:id', studentController.delete);

module.exports = router;
