const {v4 : uuidv4} = require('uuid');


class User{
    
    constructor(username,password,name,surname,gender,
        dateOfBirth,role,purchases,cart,chocolateFactory,points,customerType){

        this.id = uuidv4();
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        
        this.purchases = purchases;
        this.cart = cart;
        this.chocolateFactory = chocolateFactory;
        this.points = points;
        this.customerType = customerType;
        this.deleted = false;
        this.blocked = false;
        
    }

}

module.exports = User;