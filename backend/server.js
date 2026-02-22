require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const pool = require("./config/database")

const app = express()
const PORT = process.env.PORT || 3000

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection()
        console.log("Database connected successfully")
        connection.release()
    } catch (error) {
        console.error("Database connection failed", error.message)
        process.exit(1)
    }
}

testDatabaseConnection()

app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/auth")
const routeRoutes = require("./routes/routes")
const scheduleRoutes = require("./routes/schedules")
const bookingRoutes = require("./routes/bookings")
const userRoutes = require("./routes/users")
const driverRoutes = require("./routes/drivers")

app.use("/api/auth", authRoutes)
app.use("/api/routes", routeRoutes)
app.use("/api/schedules", scheduleRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/users", userRoutes)
app.use("/api/drivers", driverRoutes)

app.get("/api/health", (req, res) => {
    res.json({ status: "Ok", message: "Server is running" })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})