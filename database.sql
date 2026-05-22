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
('Общий клининг', 'Поддерживающая уборка квартиры или дома: полы, пыль, кухня и санузел', 1800.00),
('Генеральная уборка', 'Глубокая уборка всех помещений с проработкой труднодоступных зон', 3500.00),
('Уборка офиса', 'Краткая регулярная уборка офиса: рабочие зоны, полы, пыль и санузел', 4200.00),
('Химчистка ковров и мебели', 'Деликатная чистка мягкой мебели, ковров и удаление бытовых загрязнений', 2600.00);

INSERT INTO payment_methods (name) VALUES
('Наличные'),
('Банковская карта');
