const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const colors = require('colors');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'Event Management System API',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Route files
const events = require('./routes/eventRoutes');
const admin = require('./routes/adminRoutes');

// Mount routers
app.use('/api/events', events);
app.use('/api/admin', admin);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Create initial admin if none exists (only in development)
    if (process.env.NODE_ENV !== 'production') {
      const Admin = require('./models/Admin');
      const adminCount = await Admin.countDocuments();
      
      if (adminCount === 0) {
        const admin = new Admin({
          username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
        });
        
        await admin.save();
        console.log(colors.green('Initial admin created:'));
        console.log(colors.yellow(`Username: ${admin.username}`));
        console.log(colors.yellow(`Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`));
      }
    }

    // Start server
    const server = app.listen(
      PORT,
      console.log(
        colors.yellow.bold(
          `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        )
      )
    );

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(colors.red(`Error: ${err.message}`));
      // Close server & exit process
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.log(colors.red(`Failed to start server: ${err.message}`));
    process.exit(1);
  }
};

startServer();