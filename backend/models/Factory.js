const {v4 : uuidv4} = require('uuid');

class Factory{
    constructor(name,chocolates,workingHours,status,location,logo,rating)
    {
        this.id = uuidv4();
        this.name=name;
        this.chocolates=chocolates;
        this.workingHours=workingHours;
        this.status=status;
        this.location=location;
        this.logo=logo;
        this.rating=rating;
        this.deleted = false;
    }
}

module.exports = Factory;