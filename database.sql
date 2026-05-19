CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,
    address TEXT NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    desired_datetime TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Новая заявка',
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

INSERT INTO services (name, description, price) VALUES
('Стандартная уборка', 'Стандартная уборка квартиры или дома', 1500.00),
('Генеральная уборка', 'Полная уборка помещения с труднодоступными местами', 3000.00),
('Уборка офиса', 'Уборка выбраных коридоров и офисных кабинетов', 2500.00),
('Мойка окон', 'Мойка окон внутри и снаружи', 2000.00);

INSERT INTO payment_methods (name) VALUES ('Наличные'), ('Банковская карта');