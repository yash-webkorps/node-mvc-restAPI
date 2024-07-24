const express = require('express');
const todoRoutes = require('../routes/user')
const userRoutes = require('../routes/todo')
const router = express.Router();

router.use(todoRoutes)
router.use(userRoutes)

module.exports = router;