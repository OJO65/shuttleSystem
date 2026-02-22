const pool = require("../config/database")

class Route {
    static async create(routeData) {
        const { name, origin, destination, distance, duration, price } = routeData

        const [result] = await pool.execute(
            "INSERT INTO routes (name, origin, destination, distance, duration, price, created_at) VALUES (?,?,?,?,?,?, NOW())",
            [name, origin, destination, distance, duration, price]
        )
        return result.insertId
    }

    static async getAll() {
        const [rows] = await pool.execute(
            "SELECT * FROM routes ORDER BY created_at DESC"
        )
        return rows
    }

    static async findById(id) {
        const [rows] = await pool.execute("SELECT * FROM routes WHERE id = ?", [id])
        return rows[0]
    }

    static async update(id, routeData) {
        const { name, origin, destination, distance, duration, price } = routeData
        await pool.execute("UPDATE routes SET name = ?, origin = ?, destination = ?, distance = ?, duration = ?, price = ? WHERE id = ?",
            [name, origin, destination, distance, duration, price, id]
        )
    }

    static async delete(id) {
        await pool.execute("DELETE FROM routes WHERE id = ?", [id])
    }
}

module.exports = Route