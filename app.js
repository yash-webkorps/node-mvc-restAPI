const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv')

// Load environment variables
dotenv.config();

// Initialize Sequelize and models
const sequelize = require("./utils/database");

// Initialize Express app
const app = express();

// Middleware
app.use(express.static('public'))
app.use(bodyParser.json())

// routes
const adminRoutes = require('./routes/admin')

// Register routes
app.use(adminRoutes)

// Start server
const PORT = process.env.PORT
sequelize.sync().then(()=>{
    app.listen(PORT)
}).catch((err)=>console.log(err))