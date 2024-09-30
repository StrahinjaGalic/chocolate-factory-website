const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const chocolateRoutes = require('./routes/chocolateRoutes');
const cartRoutes = require('./routes/cartRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
const factoryRoutes = require('./routes/factoryRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const port = 3000;  // Or any other port you prefer

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle CORS
app.use(cors());

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/images/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  }
});
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const url = `http://localhost:3000/images/${req.file.filename}`;
  res.json({ url: url });
});

// Map routes
app.use('/api/chocolates', chocolateRoutes);
app.use('/api/carts', cartRoutes); 
app.use('/api/purchases', purchaseRoutes); 
app.use('/api/comments', commentRoutes); 
app.use('/api/factories', factoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
