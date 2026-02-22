const Booking = require("../models/Booking")
const Schedule = require("../models/Schedule")

const createBooking = async ( req, res) => {
    try {
        const { schedule_id, seat_number, passenger_name, passenger_phone } = req.body

        const schedule = await Schedule.findById(schedule_id)
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" })
        }

        const bookedSeats = await Booking.getByScheduleId(schedule_id)
        if (bookedSeats.includes(seat_number)) {
            return res.status(400).json({ message: "Seat already booked" })
        }

        if (schedule.available_seats <= 0) {
            return res.status(400).json({ message: "No seats available" })
        }

        const bookingData = {
            user_id: req.user.id,
            schedule_id,
            seat_number,
            passenger_name,
            passenger_phone,
            total_amount: schedule.price,
        }

        const booking = await Booking.create(bookingData)

        await Schedule.updateAvailableSeats(schedule_id, schedule.available_seats - 1)

        res.status(201).json({
            message: "Booking created successfully",
            booking,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll()
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.getByUserId(req.user.id)
        res.json(bookings)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getBookedSeats = async (req, res) => {
    try {
        const bookedSeats = await Booking.getByScheduleId(req.params.scheduleId)
        res.json(bookedSeats)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" })
        }
        res.json(booking)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { status } =req.body
        await Booking.updatedStatus(req.params.id, status)
        res.json({ message: "Booking status updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" })
        }

        await Booking.updatedStatus(req.params.id, "cancelled")

        const schedule = await Schedule.findById(booking.schedule_id)
        await Schedule.updateAvailableSeats(booking.schedule_id, schedule.available_seats + 1)

        res.json({ message: "Booking cancelled successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    createBooking,
    getBookings,
    getUserBookings,
    getBookedSeats,
    getBooking,
    updateBookingStatus,
    cancelBooking
}