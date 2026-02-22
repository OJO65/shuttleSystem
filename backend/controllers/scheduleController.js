const Schedule = require("../models/Schedule")

const createSchedule = async (req, res) => {
    try {
        const scheduleId = await Schedule.create(req.body)
        res.status(201).json({ message: "Schedule created successfully", scheduleId })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.getAll()
        res.json(schedules)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getAvailableSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.getAvailable()
        res.json(schedules)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getDriverSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.getByDriverId(req.user.id)
        res.json(schedules)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
        if(!schedule) {
            return res.status(404).json({ message: "Schedule not found" })
        }
        res.json(schedule)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const updateSchedule = async (req, res) => {
    try {
        await Schedule.update(req.params.id, req.body)
        res.json({ message: "Schedule updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const deleteSchedule = async (req, res) => {
    try {
        await Schedule.delete(req.params.id)
        res.json({ message: "Schedule deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}



module.exports = {
    createSchedule,
    getSchedules,
    getAvailableSchedules,
    getDriverSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule
}