const pool = require("../config/database")

class Booking {
    static async create(bookingData) {
        const { user_id, schedule_id, seat_number, passenger_name, passenger_phone, total_amount } = bookingData
        const booking_reference = "BK" + Date.now() + Math.floor(Math.random() * 1000)

        const [result] = await pool.execute(
            "INSERT INTO bookings (user_id, schedule_id, seat_number, passenger_name, passenger_phone, total_amount, booking_reference, status, created_at) VALUES (?,?,?,?,?,?,?, 'confirmed', NOW())",
            [user_id, schedule_id, seat_number, passenger_name, passenger_phone, total_amount, booking_reference],
        )
        return { id: result.insertId, booking_reference}
    }


static async getAll() {
    const [rows] = await pool.execute(
        `SELECT b.*, u.name as customer_name, u.email as customer_email,
        s.date, s.departure_time, s.vehicle_number,
        r.name as route_name, r.origin, r.destination
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN schedules s ON b.schedule_id = s.id
        JOIN routes r ON s.route_id = r.id
        ORDER BY b.created_at DESC`
    )
    return rows
}

    static async getByUserId(userId) {
        const [rows] = await pool.execute(
            `SELECT b.*, s.date, s.departure_time, s.arrival_time, s.vehicle_number,
            r.name as route_name, r.origin, r.destination,
            u.name as driver_name
            FROM bookings b
            JOIN schedules s ON b.schedule_id = s.id
            JOIN routes r ON s.route_id = r.id
            JOIN users u ON s.driver_id = u.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC`,
            [userId],
        )
        return rows
    }

    static async getByScheduleId(scheduleId) {
        const [rows] = await pool.execute(
            "SELECT seat_number FROM bookings WHERE schedule_id = ? AND status = 'confirmed'",
            [scheduleId],
        )
        return rows.map((row) => row.seat_number)
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT b.*, u.name as customer_name, u.email as customer_email,
            s.date, s.departure_time, s.arrival_time, s.vehicle_number,
            r.name as route_name, r.origin, r.destination
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN schedules s ON b.schedule_id = s.id
            JOIN routes r ON s.route_id = r.id
            WHERE b.id = ?`,
            [id],
        )
        return rows[0]
    }

    static async updatedStatus(id, status) {
        await pool.execute("UPDATE bookings SET status = ? WHERE id = ?", [status, id])
    }

    static async delete(id) {
        await pool.execute("DELETE FROM bookings WHERE id = ?", [id])
    }
}

module.exports = Booking