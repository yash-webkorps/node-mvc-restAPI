const Task = require("../models/todo");

// error codes
const SUCCESS = 201
const BAD_REQUEST = 400
const UNAUTHORIZED = 401
const FORBIDDEN = 403
const NOT_FOUND = 404
const CONFLICT = 409
const INTERNAL_SERVER_ERROR = 500
const SERVICE_UNAVAILABLE = 503

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.findAll();
        res.status(SUCCESS).json(tasks)
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

exports.addTask = async (req, res, next) => {
    try {
        const { taskText } = req.body;

        if (!taskText) {
            return res.status(BAD_REQUEST).json({ error: 'Task text is required' });
        }

        await Task.create({ taskText });

        res.status(SUCCESS).json({ message: 'Task Created Successfully!' });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(CONFLICT).json({ error: 'Task already exists'});
        }

        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        const {taskText, updatedTaskText} = req.body;

        if (!taskText || !updatedTaskText) {
            return res.status(BAD_REQUEST).json({ error: 'Both taskText and updatedTaskText are required' });
        }
        
        await Task.update({taskText: updatedTaskText}, {where: {taskText: taskText}}) 
    
        res.status(SUCCESS).json({message: 'Task updated successfuly'})
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}
exports.deleteTask = async (req, res, next) => {
    try {
        const {taskText} = req.query;

        if (!taskText) {
            return res.status(BAD_REQUEST).json({ error: 'taskText query parameter is required' });
        }

        await Task.destroy({where: {taskText: taskText}}) 
    
        res.status(SUCCESS).json({message: 'Task deleted successfuly'})
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}