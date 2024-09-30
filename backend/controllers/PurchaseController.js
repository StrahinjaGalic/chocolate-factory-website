const purchaseService = require('../Services/PurchaseService');

class PurchaseController {
  async getAllPurchases(req, res) {
    try {
      const purchases = await purchaseService.getAllPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPurchaseById(req, res) {
    try {
      const purchase = await purchaseService.getPurchaseById(req.params.id);
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.json(purchase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPurchase(req, res) {
    try {
      const newPurchase = await purchaseService.createPurchase(req.body);
      res.status(201).json(newPurchase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePurchase(req, res) {
    try {
      const updatedPurchase = await purchaseService.updatePurchase(req.params.id, req.body);
      if (!updatedPurchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.json(updatedPurchase);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePurchase(req, res) {
    try {
      await purchaseService.deletePurchase(req.params.id);
      res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PurchaseController();