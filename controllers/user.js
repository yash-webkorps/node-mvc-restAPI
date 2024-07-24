const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Html codes

const SUCCESS = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;
const SERVICE_UNAVAILABLE = 503;

function generateToken(id, name, email) {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function returnError(errorInput, res) {
  if (error.name === "SequelizeValidationError") {
    return res
      .status(BAD_REQUEST)
      .json({ error: "Please provide all necessary fields." });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(CONFLICT).json({ error: "Unique constraint error" });
  } else {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
}
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if any required fields are missing
    if (!name || !email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ error: "Please provide name, email, and password" });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(CONFLICT).json({ error: "Email already exist" });
    }
    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash });

    res.status(SUCCESS).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(BAD_REQUEST).json({ error: "Validation error" });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(CONFLICT).json({ error: "Unique constraint error" });
    } else {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({
          error: "An unexpected error occurred. Please try again later.",
        });
    }
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if any required fields are missing
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ error: "Please provide email, and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res
        .status(SUCCESS)
        .json({ token: generateToken(user.id, user.name, user.email) });
    } else {
      res.status(UNAUTHORIZED).json({ error: "Password does not match" });
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(BAD_REQUEST).json({ error: "Validation error" });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(CONFLICT).json({ error: "Unique constraint error" });
    } else {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({
          error: "An unexpected error occurred. Please try again later.",
        });
    }
  }
};
