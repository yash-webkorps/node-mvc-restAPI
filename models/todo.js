const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Task = sequelize.define('task', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    taskText: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = Task