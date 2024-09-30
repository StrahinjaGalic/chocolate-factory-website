const chocolateService = require('../Services/ChocolateService');

exports.getAllChocolates = async (req, res) => {
  const chocolates = await chocolateService.getAllChocolates();
  res.json(chocolates);
};

exports.getChocolateById = async (req, res) => {
  const chocolate = await chocolateService.getChocolateById(req.params.id);
  if (chocolate) {
    res.json(chocolate);
  } else {
    res.status(404).send('Chocolate not found');
  }
};

exports.createChocolate = async (req, res) => {
  const newChocolate = await chocolateService.createChocolate(req.body);
  res.status(201).json(newChocolate);
};

exports.updateChocolate = async (req, res) => {
  const updatedChocolate = await chocolateService.updateChocolate(req.params.id, req.body);
  if (updatedChocolate) {
    res.json(updatedChocolate);
  } else {
    res.status(404).send('Chocolate not found');
  }
};

exports.deleteChocolate = async (req, res) => {
  const deletedId = await chocolateService.deleteChocolate(req.params.id);
  res.json({ id: deletedId });
};