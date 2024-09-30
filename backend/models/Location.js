 const {v4 : uuidv4} = require('uuid');

class Location
{
    constructor(longitude,latitude,address)
    {
        this.id = uuidv4();
        this.longitude = longitude;
        this.latitude = latitude;
        this.address = address;
        this.deleted = false;
    }
}
module.exports = Location;