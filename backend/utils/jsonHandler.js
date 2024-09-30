const fs = require('fs').promises;
const path = require('path');

// Function to read JSON file
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(path.resolve(filePath), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file from ${filePath}:`, error);
    throw error;
  }
};

// Function to write JSON file
const writeJSON = async (filePath, data) => {
  

  try {
    await fs.writeFile(path.resolve(filePath), JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing JSON file to ${filePath}:`, error);
    throw error;
  }
  

};

module.exports = { readJSON, writeJSON };
