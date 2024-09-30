const express = require('express');
const router = express.Router();
const locationController = require('../controllers/LocationController');

router.get('/', locationController.getAllLocations);
router.get('/:locationId', locationController.getLocationById);
router.post('/', locationController.createLocation);
router.put('/:locationId', locationController.updateLocation);
router.delete('/:locationId', locationController.deleteLocation);

module.exports = router;
