const pool = require("../config/database")

class Schedule {
  static async create(scheduleData) {
    const {
      route_id,
      driver_id,
      departure_time,
      arrival_time,
      date,
      vehicle_number,
      available_seats = 14,
    } = scheduleData

    const [result] = await pool.execute(
      "INSERT INTO schedules (route_id, driver_id, departure_time, arrival_time, date, vehicle_number, available_seats, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
      [route_id, driver_id, departure_time, arrival_time, date, vehicle_number, available_seats],
    )

    return result.insertId
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT s.*, r.name as route_name, r.origin, r.destination, r.price,
             u.name as driver_name
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      JOIN users u ON s.driver_id = u.id
      ORDER BY s.date DESC, s.departure_time DESC
    `)
    return rows
  }

  static async getByDriverId(driverId) {
    const [rows] = await pool.execute(
      `
      SELECT s.*, r.name as route_name, r.origin, r.destination, r.price
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      WHERE s.driver_id = ?
      ORDER BY s.date DESC, s.departure_time DESC
    `,
      [driverId],
    )
    return rows
  }

  static async getAvailable() {
    const [rows] = await pool.execute(`
      SELECT s.*, r.name as route_name, r.origin, r.destination, r.price,
             u.name as driver_name
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      JOIN users u ON s.driver_id = u.id
      WHERE s.available_seats > 0 AND s.date >= CURDATE()
      ORDER BY s.date ASC, s.departure_time ASC
    `)
    return rows
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT s.*, r.name as route_name, r.origin, r.destination, r.price,
             u.name as driver_name
      FROM schedules s
      JOIN routes r ON s.route_id = r.id
      JOIN users u ON s.driver_id = u.id
      WHERE s.id = ?
    `,
      [id],
    )
    return rows[0]
  }

  static async update(id, scheduleData) {
    const { route_id, driver_id, departure_time, arrival_time, date, vehicle_number } = scheduleData
    await pool.execute(
      "UPDATE schedules SET route_id = ?, driver_id = ?, departure_time = ?, arrival_time = ?, date = ?, vehicle_number = ? WHERE id = ?",
      [route_id, driver_id, departure_time, arrival_time, date, vehicle_number, id],
    )
  }

  static async updateAvailableSeats(id, seats) {
    await pool.execute("UPDATE schedules SET available_seats = ? WHERE id = ?", [seats, id])
  }

  static async delete(id) {
    await pool.execute("DELETE FROM schedules WHERE id = ?", [id])
  }
}

module.exports = Schedule