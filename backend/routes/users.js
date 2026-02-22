const express = require("express")
const User = require("../models/User")
const { authenticateToken, authorizeRole } = require("../middleware/auth")

const router = express.Router()

router.get("/", authenticateToken, authorizeRole(["admin"]),
    async (req, res) => {
        try {
            const users = await User.getAll()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message })
        }
    })
router.get("/drivers", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
    try {
        const [rows] = await require("../config/database").execute(
            "SELECT id, name,  email, phone FROM users WHERE role = 'driver'"
        );
        res.json(rows); // ✅ Correct response
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router

