const express = require("express")
const {
    createBooking,
    getBookings,
    getUserBookings,
    getBookedSeats,
    getBooking,
    updateBookingStatus,
    cancelBooking
} = require("../controllers/bookingController")
const { authenticateToken, authorizeRole } = require("../middleware/auth")

const router = express.Router()

router.post("/", authenticateToken, createBooking)
router.get("/", authenticateToken, authorizeRole(["admin"]), getBookings)
router.get("/my-bookings", authenticateToken, getUserBookings)
router.get("/seats/:scheduleId", getBookedSeats)
router.get("/:id", authenticateToken, getBooking)
router.put("/:id/status", authenticateToken, authorizeRole(["admin"]), updateBookingStatus)
router.delete("/:id", authenticateToken, cancelBooking)

module.exports = router