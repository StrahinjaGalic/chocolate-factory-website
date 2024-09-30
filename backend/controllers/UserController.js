const UserService = require('../Services/UserService.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.searchUsers = async (req, res) => {
  try{
    const searchParam = req.params.searchParam;

    const users = await UserService.searchUsers(searchParam);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    const updatedUser = await UserService.updateUser(userId, userData);
    console.log(userId, userData, updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {

    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await UserService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists
    const user = await UserService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error });
  }
};
