const express = require('express');
const router = express.Router();
const chocolateController = require('../controllers/ChocolateController');

router.get('/', chocolateController.getAllChocolates);
router.get('/:id', chocolateController.getChocolateById);
router.post('/', chocolateController.createChocolate);
router.put('/:id', chocolateController.updateChocolate);
router.delete('/:id', chocolateController.deleteChocolate);

module.exports = router;