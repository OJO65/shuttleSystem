CREATE DATABASE IF NOT EXISTS shuttle_booking;
USE shuttle_booking;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('admin', 'customer', 'driver') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance DECIMAL(8,2) NOT NULL,
  duration INT NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules table
CREATE TABLE schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  driver_id INT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  date DATE NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  available_seats INT DEFAULT 14,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  seat_number INT NOT NULL,
  passenger_name VARCHAR(100) NOT NULL,
  passenger_phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- Driver shifts table
CREATE TABLE driver_shifts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  driver_id INT NOT NULL,
  schedule_id INT NOT NULL,
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  status ENUM('active', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- Insert sample admin user
INSERT INTO users (name, email, password, phone, role) VALUES 
('Admin User', 'admin@shuttle.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+254700000000', 'admin');

-- Insert sample routes
INSERT INTO routes (name, origin, destination, distance, duration, price) VALUES 
('Nairobi - Mombasa', 'Nairobi', 'Mombasa', 480.5, 480, 1500.00),
('Nairobi - Kisumu', 'Nairobi', 'Kisumu', 350.2, 360, 1200.00),
('Nairobi - Nakuru', 'Nairobi', 'Nakuru', 160.8, 180, 800.00);