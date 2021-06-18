const express = require('express');
const progressController = require('./progress.controller');
const router = express.Router();

router.get('/', progressController.getAll);
router.post('/', progressController.create);
router.put('/', progressController.update);
router.delete('/:studentId', progressController.delete);

module.exports = router;
