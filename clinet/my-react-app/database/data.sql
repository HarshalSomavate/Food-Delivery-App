-- Create database
CREATE DATABASE IF NOT EXISTS food_delivery;
USE food_delivery;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_guest BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    banner_image_url VARCHAR(500),
    logo_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.0,
    eta_min INT DEFAULT 30,
    eta_max INT DEFAULT 45,
    delivery_fee DECIMAL(10,2) DEFAULT 40.00,
    min_order DECIMAL(10,2) DEFAULT 199.00,
    address TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    restaurant_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    payment_method ENUM('cash', 'card', 'upi', 'wallet') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_delivery_time INT,
    actual_delivery_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart_item (user_id, menu_item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- User addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    restaurant_id INT,
    menu_item_id INT,
    order_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User promotions (track which users used which promotions)
CREATE TABLE IF NOT EXISTS user_promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    promotion_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_menu_item_id ON reviews(menu_item_id);

-- Insert sample data
INSERT INTO restaurants (name, description, banner_image_url, logo_url, rating, eta_min, eta_max, delivery_fee, min_order, address, phone) VALUES
('FoodHub Express', 'Delicious meals from top restaurants. Fast delivery, fresh ingredients.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80', 4.7, 20, 40, 30.00, 149.00, '123 Food Street, Downtown', '+91 9876543210'),
('SpiceRoute Indian Kitchen', 'Authentic Indian dishes made fresh to order', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80', 4.6, 25, 35, 40.00, 199.00, '456 Curry Lane, Mumbai', '+91 9876543211');

INSERT INTO categories (name, icon, color, display_order) VALUES
('All Items', '🔥', '#FF6B6B', 1),
('Pizza', '🍕', '#FF9F43', 2),
('Burgers', '🍔', '#FECA57', 3),
('Snacks', '🍟', '#54A0FF', 4),
('Dinner', '🍽️', '#5F27CD', 5),
('Indian', '🍛', '#FF9FF3', 6),
('Chinese', '🥡', '#48DBFB', 7),
('Desserts', '🍰', '#FF9FF3', 8),
('Beverages', '🥤', '#1DD1A1', 9),
('Healthy', '🥗', '#10AC84', 10);

-- Insert sample menu items for restaurant 1
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, stock, rating, is_vegetarian, is_spicy, is_bestseller) VALUES
(1, 2, 'Margherita Pizza', 'Classic cheese pizza with fresh basil', 299.00, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca', 25, 4.5, TRUE, FALSE, TRUE),
(1, 2, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 349.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 20, 4.7, FALSE, TRUE, FALSE),
(1, 3, 'Classic Cheese Burger', 'Beef patty with melted cheese', 189.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 35, 4.6, FALSE, FALSE, TRUE),
(1, 3, 'Veggie Burger', 'Plant-based patty with fresh veggies', 149.00, 'https://images.unsplash.com/photo-1550319102-8a2dcb9f9884', 40, 4.3, TRUE, FALSE, FALSE),
(1, 4, 'French Fries', 'Crispy golden fries', 99.00, 'https://images.unsplash.com/photo-1576107232684-1279f390859f', 50, 4.2, TRUE, FALSE, FALSE),
(1, 6, 'Butter Chicken', 'Creamy tomato chicken curry', 299.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 20, 4.8, FALSE, TRUE, TRUE),
(1, 8, 'Chocolate Brownie', 'Warm chocolate brownie', 149.00, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e', 40, 4.8, TRUE, FALSE, FALSE),
(1, 9, 'Fresh Lime Soda', 'Refreshing lime drink', 79.00, 'https://images.unsplash.com/photo-1621592334287-9d6bf8fa1dac', 60, 4.3, TRUE, FALSE, FALSE),
(1, 10, 'Quinoa Salad', 'Protein packed quinoa salad', 199.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 20, 4.4, TRUE, FALSE, FALSE);

-- Insert promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount, max_discount, valid_until, usage_limit) VALUES
('WELCOME20', '20% off on first order', 'percentage', 20.00, 199.00, 100.00, DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
('FREEDELIVERY', 'Free delivery on orders above ₹500', 'fixed', 30.00, 500.00, 30.00, DATE_ADD(NOW(), INTERVAL 60 DAY), NULL),
('SWEET10', '10% off on desserts', 'percentage', 10.00, 0.00, 50.00, DATE_ADD(NOW(), INTERVAL 15 DAY), NULL);

-- Insert a sample guest user
INSERT INTO users (name, email, is_guest, created_at) VALUES
('Guest User', 'guest@example.com', TRUE, NOW());