
const path = require('path');
const jsonHandler = require('../utils/jsonHandler');
const { v4: uuidv4 } = require('uuid');
const Factory = require('../models/Factory');
const Location = require('../models/Location');

const factoryFilePath = path.join(__dirname, '../data/factories.json');

class FactoryService {
  static async getAllFactories() {
    return await jsonHandler.readJSON(factoryFilePath);
  }

  static async getFactoryById(factoryId) {
    const factories = await this.getAllFactories();
    return factories.find(factory => factory.id === factoryId);
  }

  static async createFactory(factoryData) {
    const factories = await this.getAllFactories();


    const newFactory = new Factory(
      factoryData.name,
      factoryData.chocolates,
      factoryData.workingHours,
      factoryData.status,
      factoryData.location,
      factoryData.logo,
      factoryData.rating
    );
    factories.push(newFactory);
    await jsonHandler.writeJSON(factoryFilePath, factories);
    return newFactory;
  }

  static async updateFactory(factoryId, factoryData) {
    const factories = await this.getAllFactories();
    const factoryIndex = factories.findIndex(factory => factory.id === factoryId);
    if (factoryIndex !== -1) {
      const updatedFactory = {
        ...factories[factoryIndex],
        ...factoryData,
        location: factoryData.location ? new Location(
          factoryData.location.longitude,
          factoryData.location.latitude,
          factoryData.location.address
        ) : factories[factoryIndex].location
      };
      factories[factoryIndex] = updatedFactory;
      await jsonHandler.writeJSON(factoryFilePath, factories);
      return factories[factoryIndex];
    }
    throw new Error('Factory not found');
  }

  static async deleteFactory(factoryId) {
    const factories = await this.getAllFactories();
    const updatedFactories = factories.filter(factory => factory.id !== factoryId);
    await jsonHandler.writeJSON(factoryFilePath, updatedFactories);
    return factoryId;
  }

  static async addChocolates(factoryId, chocolate) {
    try {
      // Step 1: Fetch all factories
      const factories = await this.getAllFactories();

      // Step 2: Find the factory by factoryId
      const factory = factories.find(factory => factory.id === factoryId);

      // Step 3: Handle case where factory is not found
      if (!factory) {
        throw new Error('Factory not found');
      }

      // Step 4: Add new chocolate ID to the factory's chocolates array
      factory.chocolates.push(chocolate);

      // Step 5: Write updated factories array back to JSON file
      await jsonHandler.writeJSON(factoryFilePath, factories);

      // Step 6: Return the updated factory
      return factory;
    } catch (error) {
      // Step 7: Handle any errors and log them
      console.error('Error adding chocolates to factory:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }
  

  static async searchFactories(nameQuery, gradeQuery, chocolateQuery,locationQuery) {
    const factories = await jsonHandler.readJSON(factoryFilePath);
    let filteredFactories = factories;

    if (nameQuery) {
      filteredFactories = filteredFactories.filter(factory =>
        factory.name.toLowerCase().includes(nameQuery.toLowerCase())
      );
    }

    if (gradeQuery) {
      filteredFactories = filteredFactories.filter(factory =>
        factory.rating === parseFloat(gradeQuery)
      );
    }

    console.log('chocolateQuery:', chocolateQuery);
    if (chocolateQuery) {
      filteredFactories = filteredFactories.filter(factory =>
        factory.chocolates.some(chocolate => chocolate.id === chocolateQuery)
      );
    }

    if (locationQuery) {
      const [queryLongitude, queryLatitude] = locationQuery.split(',').map(Number);
  
      filteredFactories = filteredFactories.filter(factory => {
        const { longitude, latitude } = factory.location;
        return (
          Math.abs(longitude - queryLongitude) <= 1 &&
          Math.abs(latitude - queryLatitude) <= 1
        );
      });
    }

    return filteredFactories;
  }
}




module.exports = FactoryService;
