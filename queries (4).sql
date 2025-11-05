CREATE DATABASE IF NOT EXISTS gymconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gymconnect_db;

-- ==========================
-- TABLA DE USUARIOS
-- ==========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cliente') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- TABLA DE GIMNASIOS
-- ==========================
CREATE TABLE gyms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  slogan VARCHAR(200),
  description TEXT,
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  background_color VARCHAR(20),
  font_family VARCHAR(100),
  logo LONGTEXT,
  header LONGTEXT,
  gallery LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA DE MEMBRESÍAS
-- ==========================
CREATE TABLE memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gym_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA DE CLIENTES
-- ==========================
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gym_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(50),
  birthdate DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA DE PAGOS
-- ==========================
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  membership_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT (CURRENT_DATE),
  payment_method ENUM('efectivo', 'tarjeta', 'transferencia', 'online') DEFAULT 'efectivo',
  status ENUM('pagado', 'pendiente', 'fallido') DEFAULT 'pagado',
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA DE NOTIFICACIONES
-- ==========================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gym_id INT NOT NULL,
  title VARCHAR(200),
  message TEXT,
  send_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  type ENUM('vencimiento', 'promocion', 'novedad') DEFAULT 'novedad',
  FOREIGN KEY (gym_id) REFERENCES gyms(id) ON DELETE CASCADE
);

-- ==========================
-- TABLA DE HISTORIAL DE SESIONES
-- ==========================
CREATE TABLE login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(100),
  device_info VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================
-- VISTAS ÚTILES (opcionales)
-- ==========================
CREATE VIEW v_membership_status AS
SELECT 
  c.name AS cliente,
  m.name AS membresia,
  p.payment_date,
  DATE_ADD(p.payment_date, INTERVAL m.duration_days DAY) AS vencimiento,
  IF(DATE_ADD(p.payment_date, INTERVAL m.duration_days DAY) < NOW(), 'Vencida', 'Activa') AS estado
FROM clients c
JOIN payments p ON c.id = p.client_id
JOIN memberships m ON p.membership_id = m.id;
