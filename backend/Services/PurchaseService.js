const jsonHandler = require('../utils/jsonHandler');
const Purchase = require('../models/Purchase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const filePath = path.join(__dirname, '../data/purchases.json');

class PurchaseService {
  async getAllPurchases() {
    return await jsonHandler.readJSON(filePath);
  }

  async getPurchaseById(id) {
    const purchases = await jsonHandler.readJSON(filePath);
    return purchases.find(purchase => purchase.id === id);
  }

  async createPurchase(purchaseData) {
    const purchases = await jsonHandler.readJSON(filePath);
    const newPurchase = { id: uuidv4(), ...purchaseData};     
    purchases.push(newPurchase);
    await jsonHandler.writeJSON(filePath, purchases);
    return newPurchase;
  }

  async updatePurchase(id, updatedData) {
    const purchases = await jsonHandler.readJSON(filePath);
    const index = purchases.findIndex(purchase => purchase.id === id);
    if (index === -1) {
      throw new Error('Purchase not found');
    }
    purchases[index] = { ...purchases[index], ...updatedData };
    await jsonHandler.writeJSON(filePath, purchases);
    return purchases[index];
  }

  async deletePurchase(id) {
    const purchases = await jsonHandler.readJSON(filePath);
    const updatedPurchases = purchases.filter(purchase => purchase.id !== id);
    await jsonHandler.writeJSON(filePath, updatedPurchases);
    return { message: 'Purchase deleted successfully' };
  }
}

module.exports = new PurchaseService();