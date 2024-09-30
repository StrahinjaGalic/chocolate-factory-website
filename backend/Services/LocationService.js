const path = require('path');
const jsonHandler = require('../utils/jsonHandler');
const { v4: uuidv4 } = require('uuid');
const Location = require('../models/Location.js');

const locationFilePath = path.join(__dirname, '../data/locations.json');

class LocationService {
  static async getAllLocations() {
    return await jsonHandler.readJSON(locationFilePath);
  }

  static async getLocationById(locationId) {
    const locations = await this.getAllLocations();
    return locations.find(location => location.id === locationId);
  }

  static async createLocation(locationData) {
    try {
        const locations = await this.getAllLocations();
        
        console.log(locationData);

        const newLocation = new Location(
            locationData.longitude,
            locationData.latitude,
            locationData.address
        );
      

        locations.push(newLocation);
        

        await jsonHandler.writeJSON(locationFilePath, locations);
        

        return newLocation;
    } catch (error) {
        console.error('Error creating location:', error);
        throw new Error('Error creating location');
    }
}


  static async updateLocation(locationId, locationData) {

    const locations = await this.getAllLocations();
    
    const locationIndex = locations.findIndex(location => location.id === locationId);
    
    if (locationIndex !== -1) {
      const updatedLocation = {
        ...locations[locationIndex],
        ...locationData
      };
      locations[locationIndex] = updatedLocation;
      await jsonHandler.writeJSON(locationFilePath, locations);
      return locations[locationIndex];
    }
    else{
        
    }
    
    
  }

  static async deleteLocation(locationId) {
    const locations = await this.getAllLocations();
    const updatedLocations = locations.filter(location => location.id !== locationId);
    await jsonHandler.writeJSON(locationFilePath, updatedLocations);
    return locationId;
  }
}

module.exports = LocationService;
