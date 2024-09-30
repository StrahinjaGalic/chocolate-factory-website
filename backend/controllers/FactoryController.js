const FactoryService = require('../Services/FactoryService');

exports.getAllFactories = async (req, res) => {
  try {
    const factories = await FactoryService.getAllFactories();
    res.status(200).json(factories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching factories', error });
  }
};

exports.getFactoryById = async (req, res) => {
  try {
    const factory = await FactoryService.getFactoryById(req.params.factoryId);
    if (!factory) {
      return res.status(404).json({ message: 'Factory not found' });
    }
    res.status(200).json(factory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching factory', error });
  }
};

exports.searchFactories = async (req, res) => {
  try {
    const searchParams = req.params.searchParam.split('&');
    const nameQuery = searchParams[0] || '';
    const gradeQuery = searchParams[1] || '';
    const chocolateQuery = searchParams[2] || '';
    const locationQuery = searchParams[3] || '';

    const factories = await FactoryService.searchFactories(nameQuery, gradeQuery, chocolateQuery,locationQuery);
    res.status(200).json(factories);
  } catch (error) {
    res.status(500).json({ message: 'Error searching factories', error });
  }
};





exports.createFactory = async (req, res) => {
  try {
    const factoryData = req.body;
    const newFactory = await FactoryService.createFactory(factoryData);
    res.status(201).json(newFactory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating factory', error });
  }
};

exports.updateFactory = async (req, res) => {
  try {
    const { factoryId } = req.params;
    const factoryData = req.body;
    const updatedFactory = await FactoryService.updateFactory(factoryId, factoryData);
    if (!updatedFactory) {
      return res.status(404).json({ message: 'Factory not found' });
    }
    res.status(200).json(updatedFactory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating factory', error });
  }
};

exports.deleteFactory = async (req, res) => {
  try {
    const { factoryId } = req.params;
    await FactoryService.deleteFactory(factoryId);
    res.status(200).json({ message: 'Factory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting factory', error });
  }
};

exports.addChocolatesToFactory = async (req, res) => {
  try {
    const { factoryId } = req.params;
    const { chocolate } = req.body; // Note this change: Expecting a single chocolate ID
    console.log('Received factoryId:', factoryId);
    console.log('Received chocolate:', chocolate);

    const updatedFactory = await FactoryService.addChocolates(factoryId, chocolate);
    
    if (!updatedFactory) {
      return res.status(404).json({ message: 'Factory not found' });
    }

    res.status(200).json(updatedFactory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding chocolates to factory', error });
  }
};
