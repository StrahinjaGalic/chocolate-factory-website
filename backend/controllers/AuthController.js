const UserService = require('../Services/UserService');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';  // Replace with your actual secret key

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    console.log(req.body);

    try {
      const users = await UserService.getAllUsers();
      const user = users.find(user => user.username === username);
      console.log(user);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
      res.json({ token,id:user.id, username: user.username,role: user.role,factoryId:user.chocolateFactory.id,blocked:user.blocked}); //ovdje odredjujes sta ti vraca login uz token
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;