const path = require('path');
const jsonHandler = require('../utils/jsonHandler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const CustomerType = require('../models/CustomerType');

const userFilePath = path.join(__dirname, '../data/users.json');

class UserService {
  
    static async getAllUsers() {
      try {
        const users = await jsonHandler.readJSON(userFilePath);
        return users;
      } catch (error) {
        console.error("Error reading users file:", error); // Log the error
        throw new Error('Error retrieving users');
      }
    }

    static async searchUsers(searchParam) {
      const users = await this.getAllUsers();
      let filteredUsers = users;

      
      if (searchParam) {
        filteredUsers = users.filter(user => {
          return user.username.toLowerCase().includes(searchParam.toLowerCase()) ||
            user.name.toLowerCase().includes(searchParam.toLowerCase()) ||
            user.surname.toLowerCase().includes(searchParam.toLowerCase());
        });
      }
      return filteredUsers;
    }
  

  static async getUserById(userId) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === userId);
  }

  static async createUser(userData) {
    const users = await this.getAllUsers();
    const customerType = new CustomerType(
      userData.customerType.name,
      userData.customerType.discountPercentage,
      userData.customerType.pointsRequiredForDiscount
    );
    const newUser = new User(
      userData.username,
      userData.password,
      userData.name,
      userData.surname,
      userData.gender,
      userData.dateOfBirth,
      userData.role,
      userData.purchases,
      userData.cart,
      userData.chocolateFactory,
      userData.points,
      customerType
    );
    users.push(newUser);
    await jsonHandler.writeJSON(userFilePath, users);
    return newUser;
  }

  static async updateUser(userId, userData) {
    const users = await this.getAllUsers();

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      try {

        const updatedUser = {
          ...users[userIndex],
          ...userData
        };

        users[userIndex] = updatedUser;
        await jsonHandler.writeJSON(userFilePath, users);
        return updatedUser;

      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
      }
    } else {
      console.error('User not found:', userId);
      throw new Error('User not found');
    }
  }
  


  static async deleteUser(userId) {
    const users = await this.getAllUsers();
    const updatedUsers = users.filter(user => user.id !== userId);
    await jsonHandler.writeJSON(userFilePath, updatedUsers);
    return userId;
  }
}

module.exports = UserService;
