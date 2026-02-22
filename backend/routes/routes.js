const express = require("express")
const { createRoute, getRoutes, getRoute, updateRoute, deleteRoute } = require("../controllers/routeController")
const { authenticateToken, authorizeRole } = require("../middleware/auth")

const router = express.Router()

router.post("/", authenticateToken, authorizeRole(["admin"]), createRoute)
router.get("/", getRoutes)
router.get("/:id", getRoute)
router.put("/:id", authenticateToken, authorizeRole(["admin"]), updateRoute)
router.delete("/:id", authenticateToken, authorizeRole(["admin"]), deleteRoute)

module.exports = router