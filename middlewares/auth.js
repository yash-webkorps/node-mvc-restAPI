const jwt = require('jsonwebtoken');
const User = require('../models/user');
// Html codes

const SUCCESS = 201
const BAD_REQUEST = 400
const UNAUTHORIZED = 401
const FORBIDDEN = 403
const NOT_FOUND = 404
const CONFLICT = 409
const INTERNAL_SERVER_ERROR = 500
const SERVICE_UNAVAILABLE = 503

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('auth');
        if (!token) {
            return res.status(UNAUTHORIZED).json({ error: 'No token provided' });
        }

        const userAsPerToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(userAsPerToken.id);

        if (!user) {
            return res.status(NOT_FOUND).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(UNAUTHORIZED).json({ error: 'Invalid token' });
        }
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
}
