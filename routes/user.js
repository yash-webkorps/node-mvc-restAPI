const express = require('express');
const userController = require('../controllers/user')

const router = express.Router();

router.get('/', (req, res, next)=>{
    res.sendFile('signup.html', {root: 'views'})
})
router.get('/login', (req, res, next)=>{
    res.sendFile('login.html', {root: 'views'})
})
router.post('/signup', userController.signup)
router.post('/login', userController.login)

module.exports = router;