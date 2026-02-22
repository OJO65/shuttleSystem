const express = require("express")
const { authenticateToken, authorizeRole } = require("../middleware/auth")
const pool = require("../config/database")

const router = express.Router()

router.post("/shift/start", authenticateToken, authorizeRole(["driver"]), async (req, res) => {
    try {
        const { schedule_id } = req.body

        await pool.execute(
            "INSERT INTO driver_shifts (driver_id, start_time, status) VALUES (?,?, NOW(), 'active')",
            [req.user.id, schedule_id]
        )

        res.json({ message: "Shift started successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.post("/shift/end/:shiftId", authenticateToken, authorizeRole(["driver"]), async (res, req) => {
    try {
        await pool.execute(
            "UPDATE driver_shifts SET end_time = NOW(), status = 'completed' WHERE id= ? AND driver_id = ?",
            [req.params.shiftId, req.user.id],
        )

        res.json({ message: "Shift ended successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

router.get("/shifts", authenticateToken, authorizeRole(["driver"]), async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT ds.*, s.date, s.departure_time, s.arrival_time, s.vehicle_number,
            r.name as route_name, r.origin, r.destination
            FROM driver_shifts ds
            JOIN schedules s ON ds.schedule_id = s.id
            JOIN routes r ON s.route_id = r.id
            WHERE ds.driver_id = ?
            ORDER BY ds.start_time DESC`, [req.user.id],
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

module.exports = router