const pool = require("../config/database")
const bcrypt = require("bcryptjs")

class User {
  static async create(userData) {
    const { name, email, password, phone, role = "customer" } = userData
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const [result] = await pool.execute(
        "INSERT INTO users (name, email, password, phone, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [name, email, hashedPassword, phone, role],
      )
      return result.insertId
    } catch (dbError) {
      console.error("Database error during user creation:", dbError)
      // Re-throw the error so it can be caught by the controller's try-catch
      throw dbError
    }
  }

  // Ensure findByEmail is a static method
  static async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])
    return rows[0]
  }

  // Ensure findById is a static method
  static async findById(id) {
    const [rows] = await pool.execute("SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?", [id])
    return rows[0]
  }

  // Ensure getAll is a static method
  static async getAll() {
    const [rows] = await pool.execute(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC",
    )
    return rows
  }

  // Ensure update is a static method
  static async update(id, userData) {
    const { name, email, phone } = userData
    await pool.execute("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id])
  }

  // Ensure delete is a static method
  static async delete(id) {
    await pool.execute("DELETE FROM users WHERE id = ?", [id])
  }
}

module.exports = User