const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const userId = await User.create({ name, email, password, phone, role })

    res.status(201).json({
      message: "User created successfully",
      userId,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { register, login, getProfile }