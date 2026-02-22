const express = require("express")
const {
    createSchedule,
    getSchedules,
    getAvailableSchedules,
    getDriverSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule
} = require("../controllers/scheduleController")
const { authenticateToken, authorizeRole } = require("../middleware/auth")

const router = express.Router()

router.post("/", authenticateToken, authorizeRole(["admin"]), createSchedule)
router.get("/", authenticateToken, getSchedules)
router.get("/available", getAvailableSchedules)
router.get("/driver", authenticateToken, authorizeRole(["driver"]), getDriverSchedules)
router.get("/:id", getSchedule)
router.put("/:id", authenticateToken, authorizeRole(["admin"]), updateSchedule)
router.delete("/:id", authenticateToken, authorizeRole(["admin"]), deleteSchedule)


module.exports = router