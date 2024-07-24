const express = require('express');
const todoController = require('../controllers/todo')
const userAuthentication = require('../middlewares/auth')
const router = express.Router();

router.get('/todo', (req, res, next)=>{
    res.sendFile('todo.html', {root: 'views'})
})

router.get('/getTasks', userAuthentication.auth, todoController.getTasks)
router.post('/addTask', userAuthentication.auth, todoController.addTask)
router.put('/updateTask', userAuthentication.auth, todoController.updateTask)
router.delete('/deleteTask', userAuthentication.auth, todoController.deleteTask)

module.exports = router;