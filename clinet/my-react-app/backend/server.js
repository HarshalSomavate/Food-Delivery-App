const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Your MySQL password
  database: 'food_delivery'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
  
  // Create tables
  createTables();
});

// Create tables
function createTables() {
  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password_hash VARCHAR(255),
      is_guest BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Restaurants table
    `CREATE TABLE IF NOT EXISTS restaurants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      banner_image_url VARCHAR(500),
      logo_url VARCHAR(500),
      rating DECIMAL(3,2) DEFAULT 4.5,
      eta_min INT DEFAULT 25,
      eta_max INT DEFAULT 40,
      delivery_fee DECIMAL(10,2) DEFAULT 40.00,
      min_order DECIMAL(10,2) DEFAULT 199.00,
      address TEXT,
      phone VARCHAR(20),
      is_active BOOLEAN DEFAULT TRUE
    )`,
    
    // Menu items table
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      restaurant_id INT NOT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url VARCHAR(500),
      stock INT DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 4.0,
      category VARCHAR(50),
      tags VARCHAR(255),
      is_bestseller BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )`,
    
    // Cart table
    `CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      menu_item_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_cart_item (user_id, menu_item_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    )`,
    
    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      user_id INT,
      restaurant_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      delivery_fee DECIMAL(10,2) DEFAULT 0.00,
      final_amount DECIMAL(10,2) NOT NULL,
      delivery_address TEXT,
      order_status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
      estimated_delivery_time INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )`
  ];

  queries.forEach((query) => {
    db.query(query, (err) => {
      if (err) console.error('Table creation error:', err.message);
    });
  });

  // Insert sample data
  insertSampleData();
}

// Insert sample data
function insertSampleData() {
  // Check if data exists
  db.query('SELECT COUNT(*) as count FROM restaurants', (err, results) => {
    if (err) return;
    
    if (results[0].count === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert restaurant
      const restaurantQuery = `
        INSERT INTO restaurants (name, description, banner_image_url, logo_url, rating, eta_min, eta_max, delivery_fee, min_order, address, phone) VALUES
        ('FoodHub Express', 'Delicious meals from top restaurants', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&w=80&q=80', 4.7, 20, 40, 30.00, 149.00, '123 Food Street, Downtown', '+91 9876543210')
      `;
      
      db.query(restaurantQuery, (err) => {
        if (err) {
          console.error('Error inserting restaurant:', err.message);
          return;
        }
        
        // Insert menu items
        const menuQuery = `
          INSERT INTO menu_items (restaurant_id, name, description, price, image_url, stock, rating, category, tags, is_bestseller) VALUES
          (1, 'Margherita Pizza', 'Classic cheese pizza with fresh basil', 299.00, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca', 25, 4.5, 'pizza', 'Vegetarian,Best Seller', TRUE),
          (1, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 349.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 20, 4.7, 'pizza', 'Non-Veg,Spicy', FALSE),
          (1, 'Classic Cheese Burger', 'Beef patty with melted cheese', 189.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 35, 4.6, 'burger', 'Non-Veg,Best Seller', TRUE),
          (1, 'Veggie Burger', 'Plant-based patty with fresh veggies', 149.00, 'https://images.unsplash.com/photo-1550319102-8a2dcb9f9884', 40, 4.3, 'burger', 'Vegetarian,Healthy', FALSE),
          (1, 'French Fries', 'Crispy golden fries', 99.00, 'https://images.unsplash.com/photo-1576107232684-1279f390859f', 50, 4.2, 'snacks', 'Vegetarian', FALSE),
          (1, 'Butter Chicken', 'Creamy tomato chicken curry', 299.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 20, 4.8, 'dinner', 'Non-Veg,Spicy,Best Seller', TRUE),
          (1, 'Chocolate Brownie', 'Warm chocolate brownie', 149.00, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e', 40, 4.8, 'dessert', 'Vegetarian', FALSE),
          (1, 'Fresh Lime Soda', 'Refreshing lime drink', 79.00, 'https://images.unsplash.com/photo-1621592334287-9d6bf8fa1dac', 60, 4.3, 'beverages', 'Vegetarian', FALSE),
          (1, 'Quinoa Salad', 'Protein packed quinoa salad', 199.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 20, 4.4, 'healthy', 'Vegetarian,Healthy', FALSE)
        `;
        
        db.query(menuQuery, (err) => {
          if (err) console.error('Error inserting menu items:', err.message);
          else console.log('✅ Sample data inserted successfully');
        });
      });
    }
  });
}

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ========== API ROUTES ==========

// Health check
app.get('/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).json({ status: 'unhealthy' });
    res.json({ status: 'healthy' });
  });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(400).json({ error: 'User already exists' });
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      db.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
          
          res.json({
            success: true,
            token,
            user: { id: result.insertId, name, email }
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      
      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password_hash || '');
      if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, is_guest: user.is_guest }
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create guest user
app.post('/api/auth/guest', (req, res) => {
  const guestEmail = `guest_${Date.now()}@example.com`;
  const guestName = 'Guest User';
  
  db.query(
    'INSERT INTO users (name, email, is_guest) VALUES (?, ?, TRUE)',
    [guestName, guestEmail],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const token = jwt.sign(
        { userId: result.insertId, email: guestEmail, isGuest: true },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        user: {
          id: result.insertId,
          name: guestName,
          email: guestEmail,
          is_guest: true
        }
      });
    }
  );
});

// Get restaurant data
app.get('/api/restaurant', (req, res) => {
  db.query('SELECT * FROM restaurants WHERE is_active = TRUE LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'No restaurant found' });
    res.json(results[0]);
  });
});

// Get menu items
app.get('/api/menu', (req, res) => {
  const { category, search } = req.query;
  
  let query = 'SELECT * FROM menu_items WHERE is_active = TRUE';
  const params = [];
  
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY is_bestseller DESC, name';
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Get categories
    db.query('SELECT DISTINCT category FROM menu_items WHERE is_active = TRUE ORDER BY category', (err2, categories) => {
      if (err2) return res.status(500).json({ error: err2.message });
      
      res.json({
        menu: results,
        categories: categories.map(c => c.category).filter(Boolean)
      });
    });
  });
});

// ========== CART ROUTES ==========

// Get cart
app.get('/api/cart', authMiddleware, (req, res) => {
  const userId = req.userId;
  
  db.query(`
    SELECT c.*, m.name, m.description, m.price, m.image_url, m.stock, m.category
    FROM cart c
    JOIN menu_items m ON c.menu_item_id = m.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let subtotal = 0;
    let itemCount = 0;
    
    const items = results.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      itemCount += item.quantity;
      
      return {
        id: item.menu_item_id,
        cartId: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        quantity: item.quantity,
        total: itemTotal,
        stock: item.stock,
        category: item.category
      };
    });
    
    res.json({
      items,
      subtotal,
      itemCount
    });
  });
});

// Add to cart
app.post('/api/cart', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { menuItemId, quantity = 1 } = req.body;
  
  db.query('SELECT * FROM menu_items WHERE id = ?', [menuItemId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Item not found' });
    
    const item = results[0];
    if (item.stock < quantity) {
      return res.status(400).json({ error: `Only ${item.stock} items available` });
    }
    
    db.query(
      'SELECT * FROM cart WHERE user_id = ? AND menu_item_id = ?',
      [userId, menuItemId],
      (err, cartResults) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (cartResults.length > 0) {
          const newQuantity = cartResults[0].quantity + quantity;
          if (item.stock < newQuantity) {
            return res.status(400).json({ error: `Cannot add ${quantity} more items` });
          }
          
          db.query(
            'UPDATE cart SET quantity = ? WHERE id = ?',
            [newQuantity, cartResults[0].id],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ success: true, message: 'Cart updated' });
            }
          );
        } else {
          db.query(
            'INSERT INTO cart (user_id, menu_item_id, quantity) VALUES (?, ?, ?)',
            [userId, menuItemId, quantity],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ success: true, message: 'Item added to cart' });
            }
          );
        }
      }
    );
  });
});

// Update cart item
app.put('/api/cart/:menuItemId', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { menuItemId } = req.params;
  const { quantity } = req.body;
  
  if (quantity < 1) {
    db.query(
      'DELETE FROM cart WHERE user_id = ? AND menu_item_id = ?',
      [userId, menuItemId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Item removed from cart' });
      }
    );
  } else {
    db.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND menu_item_id = ?',
      [quantity, userId, menuItemId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Cart updated' });
      }
    );
  }
});

// Remove from cart
app.delete('/api/cart/:menuItemId', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { menuItemId } = req.params;
  
  db.query(
    'DELETE FROM cart WHERE user_id = ? AND menu_item_id = ?',
    [userId, menuItemId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Item removed from cart' });
    }
  );
});

// Clear cart
app.delete('/api/cart', authMiddleware, (req, res) => {
  const userId = req.userId;
  
  db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Cart cleared' });
  });
});

// ========== ORDER ROUTES ==========

// Create order
app.post('/api/orders', authMiddleware, (req, res) => {
  const userId = req.userId;
  const { items, deliveryAddress } = req.body;
  
  // Start transaction
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Get restaurant details (assuming single restaurant for now)
    db.query('SELECT * FROM restaurants WHERE id = 1', (err, results) => {
      if (err) return rollback(res, err);
      if (results.length === 0) return rollback(res, new Error('Restaurant not found'));
      
      const restaurant = results[0];
      
      // Calculate totals from cart
      db.query(`
        SELECT c.quantity, m.price, m.id as menu_item_id, m.stock
        FROM cart c
        JOIN menu_items m ON c.menu_item_id = m.id
        WHERE c.user_id = ?
      `, [userId], (err, cartItems) => {
        if (err) return rollback(res, err);
        
        if (cartItems.length === 0) {
          return rollback(res, new Error('Cart is empty'));
        }
        
        // Validate stock and calculate subtotal
        let subtotal = 0;
        for (const item of cartItems) {
          if (item.stock < item.quantity) {
            return rollback(res, new Error(`Insufficient stock for item ${item.menu_item_id}`));
          }
          subtotal += item.price * item.quantity;
        }
        
        // Check minimum order
        if (subtotal < restaurant.min_order) {
          return rollback(res, new Error(`Minimum order is ₹${restaurant.min_order}`));
        }
        
        const deliveryFee = subtotal >= 500 ? 0 : restaurant.delivery_fee;
        const finalAmount = subtotal + deliveryFee;
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const estimatedDeliveryTime = restaurant.eta_min + Math.floor(Math.random() * (restaurant.eta_max - restaurant.eta_min + 1));
        
        // Create order
        db.query(
          `INSERT INTO orders (
            order_number, user_id, restaurant_id, total_amount, delivery_fee,
            final_amount, delivery_address, estimated_delivery_time
          ) VALUES (?, ?, 1, ?, ?, ?, ?, ?)`,
          [orderNumber, userId, subtotal, deliveryFee, finalAmount, deliveryAddress || 'Default Address', estimatedDeliveryTime],
          (err, result) => {
            if (err) return rollback(res, err);
            
            const orderId = result.insertId;
            
            // Update stock and clear cart
            const updateStock = (index) => {
              if (index >= cartItems.length) {
                db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
                  if (err) return rollback(res, err);
                  
                  db.commit((err) => {
                    if (err) return rollback(res, err);
                    
                    res.json({
                      success: true,
                      message: 'Order placed successfully',
                      data: {
                        orderId,
                        orderNumber,
                        estimatedDeliveryTime,
                        finalAmount
                      }
                    });
                  });
                });
                return;
              }
              
              const item = cartItems[index];
              db.query(
                'UPDATE menu_items SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.menu_item_id],
                (err) => {
                  if (err) return rollback(res, err);
                  updateStock(index + 1);
                }
              );
            };
            
            updateStock(0);
          }
        );
      });
    });
  });
});

// Get user orders
app.get('/api/orders', authMiddleware, (req, res) => {
  const userId = req.userId;
  
  db.query(
    `SELECT o.*, r.name as restaurant_name
     FROM orders o
     JOIN restaurants r ON o.restaurant_id = r.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Helper for rollback
function rollback(res, error) {
  db.rollback(() => {
    res.status(400).json({ error: error.message });
  });
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});