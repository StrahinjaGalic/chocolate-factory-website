const LocationService = require('../Services/LocationService.js');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await LocationService.getAllLocations();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving locations', error });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await LocationService.getLocationById(req.params.locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving location', error });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const locationData = req.body;
    const newLocation = await LocationService.createLocation(locationData);
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const locationData = req.body;
    const updatedLocation = await LocationService.updateLocation(locationId, locationData);
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    await LocationService.deleteLocation(locationId);
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error });
  }
};
