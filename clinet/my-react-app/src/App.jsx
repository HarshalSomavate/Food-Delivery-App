import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, X, Trash2, User, Clock, Star, MapPin, Phone, Mail, Shield, Truck, Award, Plus, Minus, Heart, ChevronRight, Filter, TrendingUp, Flame, Leaf, Coffee, CheckCircle } from 'lucide-react';

// --- Food Delivery App with Multiple Categories ---
const RESTAURANT = {
  id: 1,
  name: 'FoodHub Express',
  description: 'Delicious meals from top restaurants. Fast delivery, fresh ingredients.',
  rating: 4.7,
  etaMin: 20,
  etaMax: 40,
  banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  address: '123 Food Street, Downtown',
  phone: '+91 98765 43210',
  deliveryFee: 30,
  minOrder: 149,
  specials: [
    'Free delivery on orders above ₹500',
    '20% off on first order',
    'Extra 10% off with online payment',
    'Complimentary dessert on orders above ₹800'
  ]
};

// Food categories
const FOOD_CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🔥', color: '#FF6B6B' },
  { id: 'pizza', name: 'Pizza', icon: '🍕', color: '#FF9F43' },
  { id: 'burger', name: 'Burgers', icon: '🍔', color: '#FECA57' },
  { id: 'snacks', name: 'Snacks', icon: '🍟', color: '#54A0FF' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️', color: '#5F27CD' },
  { id: 'indian', name: 'Indian', icon: '🍛', color: '#FF9FF3' },
  { id: 'chinese', name: 'Chinese', icon: '🥡', color: '#48DBFB' },
  { id: 'dessert', name: 'Desserts', icon: '🍰', color: '#FF9FF3' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#1DD1A1' },
  { id: 'healthy', name: 'Healthy', icon: '🥗', color: '#10AC84' },
];

// Menu items across all categories
const MENU = [
  // Pizza
  { id: 101, name: 'Margherita Pizza', price: 299, category: 'pizza', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 25, description: 'Classic cheese pizza with fresh basil', rating: 4.5, tags: ['Vegetarian', 'Best Seller'] },
  { id: 102, name: 'Pepperoni Pizza', price: 349, category: 'pizza', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 20, description: 'Spicy pepperoni with mozzarella', rating: 4.7, tags: ['Non-Veg', 'Spicy'] },
  { id: 103, name: 'Veg Supreme Pizza', price: 329, category: 'pizza', img: 'https://images.unsplash.com/photo-1593246049226-ded77bf90326?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 18, description: 'Loaded with vegetables and cheese', rating: 4.4, tags: ['Vegetarian'] },
  
  // Burgers
  { id: 201, name: 'Classic Cheese Burger', price: 189, category: 'burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 35, description: 'Beef patty with melted cheese', rating: 4.6, tags: ['Non-Veg', 'Best Seller'] },
  { id: 202, name: 'Chicken Burger', price: 169, category: 'burger', img: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 30, description: 'Grilled chicken with special sauce', rating: 4.5, tags: ['Non-Veg'] },
  { id: 203, name: 'Veggie Burger', price: 149, category: 'burger', img: 'https://images.unsplash.com/photo-1550319102-8a2dcb9f9884?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 40, description: 'Plant-based patty with fresh veggies', rating: 4.3, tags: ['Vegetarian', 'Healthy'] },
  
  // Snacks
  { id: 301, name: 'French Fries', price: 99, category: 'snacks', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 50, description: 'Crispy golden fries', rating: 4.2, tags: ['Vegetarian'] },
  { id: 302, name: 'Chicken Wings', price: 249, category: 'snacks', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 25, description: 'Spicy buffalo wings', rating: 4.7, tags: ['Non-Veg', 'Spicy'] },
  { id: 303, name: 'Paneer Tikka', price: 199, category: 'snacks', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 30, description: 'Grilled cottage cheese cubes', rating: 4.6, tags: ['Vegetarian'] },
  
  // Dinner
  { id: 401, name: 'Butter Chicken', price: 299, category: 'dinner', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 20, description: 'Creamy tomato chicken curry', rating: 4.8, tags: ['Non-Veg', 'Best Seller'] },
  { id: 402, name: 'Veg Biryani', price: 229, category: 'dinner', img: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 25, description: 'Fragrant rice with vegetables', rating: 4.5, tags: ['Vegetarian'] },
  { id: 403, name: 'Grilled Salmon', price: 449, category: 'dinner', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 15, description: 'Atlantic salmon with herbs', rating: 4.9, tags: ['Non-Veg', 'Premium'] },
  
  // Indian
  { id: 501, name: 'Paneer Butter Masala', price: 259, category: 'indian', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 22, description: 'Paneer in rich tomato gravy', rating: 4.6, tags: ['Vegetarian'] },
  { id: 502, name: 'Chicken Curry', price: 279, category: 'indian', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 18, description: 'Spicy Indian chicken curry', rating: 4.7, tags: ['Non-Veg', 'Spicy'] },
  
  // Chinese
  { id: 601, name: 'Veg Manchurian', price: 199, category: 'chinese', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 30, description: 'Crispy veg balls in sauce', rating: 4.4, tags: ['Vegetarian'] },
  { id: 602, name: 'Chicken Fried Rice', price: 229, category: 'chinese', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 25, description: 'Fried rice with chicken pieces', rating: 4.6, tags: ['Non-Veg'] },
  
  // Desserts
  { id: 701, name: 'Chocolate Brownie', price: 149, category: 'dessert', img: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 40, description: 'Warm chocolate brownie', rating: 4.8, tags: ['Vegetarian'] },
  { id: 702, name: 'Ice Cream Sundae', price: 129, category: 'dessert', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 35, description: 'Vanilla ice cream with toppings', rating: 4.5, tags: ['Vegetarian'] },
  
  // Beverages
  { id: 801, name: 'Fresh Lime Soda', price: 79, category: 'beverages', img: 'https://images.unsplash.com/photo-1621592334287-9d6bf8fa1dac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 60, description: 'Refreshing lime drink', rating: 4.3, tags: ['Vegetarian'] },
  { id: 802, name: 'Cold Coffee', price: 129, category: 'beverages', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 45, description: 'Iced coffee with cream', rating: 4.6, tags: ['Vegetarian'] },
  
  // Healthy
  { id: 901, name: 'Quinoa Salad', price: 199, category: 'healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 20, description: 'Protein packed quinoa salad', rating: 4.4, tags: ['Vegetarian', 'Healthy'] },
  { id: 902, name: 'Avocado Toast', price: 179, category: 'healthy', img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', stock: 25, description: 'Whole grain toast with avocado', rating: 4.5, tags: ['Vegetarian', 'Healthy'] },
];

async function fetchMenu() { 
  return new Promise(res => setTimeout(() => res(MENU), 300)); 
}

async function placeOrder(payload) { 
  return new Promise(res => setTimeout(() => res({ 
    ok: true, 
    orderId: Math.floor(Math.random()*900000)+100000, 
    eta: RESTAURANT.etaMin + Math.floor(Math.random() * (RESTAURANT.etaMax - RESTAURANT.etaMin + 1)),
    total: payload.subtotal + (payload.subtotal < 500 ? RESTAURANT.deliveryFee : 0)
  }), 800)); 
}

function safeParse(raw, fallback) { 
  try { 
    return JSON.parse(raw); 
  } catch { 
    return fallback; 
  }
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try { 
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null; 
      return raw ? safeParse(raw, initial) : initial; 
    } catch { 
      return initial; 
    }
  });
  
  useEffect(() => { 
    try { 
      localStorage.setItem(key, JSON.stringify(state)); 
    } catch {} 
  }, [key, state]);
  
  return [state, setState];
}

function useLocalUser() {
  const [user, setUser] = useState(() => {
    try { 
      const raw = typeof window !== 'undefined' ? localStorage.getItem('food_user_v1') : null; 
      return raw ? safeParse(raw, null) : null; 
    } catch { 
      return null; 
    }
  });
  
  useEffect(() => { 
    try { 
      localStorage.setItem('food_user_v1', JSON.stringify(user)); 
    } catch {} 
  }, [user]);
  
  return [user, setUser];
}

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('food_cart_v1', {});

  const addToCart = useCallback((item, qty = 1) => {
    if (!item || item.id == null) return;
    
    setCart(prev => {
      const existing = prev[item.id] ? { ...prev[item.id] } : { ...item, qty: 0 };
      const newQty = (Number(existing.qty) || 0) + (Number(qty) || 0);
      
      if (newQty > item.stock) {
        alert(`Only ${item.stock} items available in stock`);
        return prev;
      }
      
      return { ...prev, [item.id]: { ...existing, qty: newQty } };
    });
  }, [setCart]);

  const updateQty = useCallback((id, qty) => {
    setCart(prev => {
      const it = prev[id]; 
      if (!it) return prev; 
      
      const q = Number(qty);
      if (!Number.isFinite(q) || q < 1) { 
        const copy = { ...prev }; 
        delete copy[id]; 
        return copy; 
      }
      
      const menuItem = MENU.find(m => m.id === id);
      if (menuItem && q > menuItem.stock) {
        alert(`Only ${menuItem.stock} items available in stock`);
        return prev;
      }
      
      return { ...prev, [id]: { ...it, qty: q } };
    });
  }, [setCart]);

  const removeFromCart = useCallback(id => 
    setCart(prev => { 
      if (!prev[id]) return prev; 
      const copy = { ...prev }; 
      delete copy[id]; 
      return copy; 
    }), [setCart]);

  const clearCart = useCallback(() => setCart({}), [setCart]);

  const items = Object.values(cart).map(i => ({ ...i, qty: Number(i.qty) }));
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  const totalItems = items.reduce((total, it) => total + (Number(it.qty) || 0), 0);
  const deliveryFee = subtotal < 500 ? RESTAURANT.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ 
      cart, 
      items, 
      subtotal, 
      deliveryFee,
      total,
      totalItems,
      addToCart, 
      updateQty, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() { 
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// --- UI Components ---
function Header({ onToggleCart, onOpenLogin, user, cartCount }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <motion.div 
            className="logo-wrapper"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="logo-icon">🍕</div>
          </motion.div>
          <div>
            <div className="restaurant-name">{RESTAURANT.name}</div>
            <div className="restaurant-description hidden-sm">{RESTAURANT.description}</div>
          </div>
        </div>

        <div className="header-actions">
          <div className="delivery-time hidden-sm">
            <Clock className="delivery-time-icon" />
            <div className="delivery-time-text">{RESTAURANT.etaMin}-{RESTAURANT.etaMax} mins</div>
          </div>

          <div className="hidden-sm">
            {user && user.email ? (
              <div className="user-info">
                <User className="user-icon"/>
                <span className="username">{user.email.split('@')[0]}</span>
                <button 
                  onClick={() => onOpenLogin(true)} 
                  className="signout-button"
                >
                  (Logout)
                </button>
              </div>
            ) : (
              <button onClick={() => onOpenLogin(false)} className="signin-button">
                Sign in
              </button>
            )}
          </div>

          <motion.button 
            onClick={onToggleCart} 
            aria-label="Cart" 
            className="cart-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="cart-icon" />
            {cartCount > 0 && (
              <motion.span 
                className="cart-count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="hero" style={{ backgroundImage: `url(${RESTAURANT.banner})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Craving Something <span className="highlight">Delicious?</span>
          </motion.h1>
          <motion.p 
            className="hero-description"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Order your favorite food from top restaurants near you
          </motion.p>
          <motion.div 
            className="hero-info"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="rating">
              <Star size={16} style={{ display: 'inline', marginRight: '4px' }} />
              {RESTAURANT.rating}
            </div>
            <div className="eta">
              <Clock size={16} style={{ marginRight: '4px' }} />
              {RESTAURANT.etaMin}-{RESTAURANT.etaMax} mins
            </div>
            <div className="min-order">
              <Shield size={16} style={{ marginRight: '4px' }} />
              Min. order: ₹{RESTAURANT.minOrder}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CategoryFilter({ activeCategory, setActiveCategory }) {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="category-filter-container">
      <div className="category-scroll-buttons left" onClick={() => scroll('left')}>
        <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
      </div>
      <div className="category-scroll-wrapper">
        <div className="categories-list" ref={scrollContainerRef}>
          {FOOD_CATEGORIES.map(category => (
            <motion.button
              key={category.id}
              className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--category-color': category.color }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="category-scroll-buttons right" onClick={() => scroll('right')}>
        <ChevronRight size={20} />
      </div>
    </div>
  );
}

function FilterBar({ search, setSearch, activeCategory, setActiveCategory }) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  return (
    <div className="filter-section">
      <div className="search-bar">
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search for dishes, restaurants..." 
            className="search-input" 
          />
        </div>
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      <CategoryFilter 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {showFilters && (
        <motion.div 
          className="advanced-filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="filter-group">
            <label>Sort by:</label>
            <div className="sort-options">
              {['default', 'price-low', 'price-high', 'rating', 'popular'].map(option => (
                <button
                  key={option}
                  className={`sort-option ${sortBy === option ? 'active' : ''}`}
                  onClick={() => setSortBy(option)}
                >
                  {option === 'default' && 'Default'}
                  {option === 'price-low' && 'Price: Low to High'}
                  {option === 'price-high' && 'Price: High to Low'}
                  {option === 'rating' && 'Rating'}
                  {option === 'popular' && 'Popular'}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Dietary Preferences:</label>
            <div className="diet-options">
              {['Vegetarian', 'Non-Veg', 'Spicy', 'Healthy'].map(pref => (
                <button key={pref} className="diet-option">
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DishCard({ dish, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [favorite, setFavorite] = useState(false);
  
  const handleAdd = async () => {
    setAdding(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    onAdd(dish);
    setAdding(false);
  };
  
  return (
    <motion.div 
      className="dish-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="dish-image">
        <img src={dish.img} alt={dish.name} loading="lazy" />
        <button 
          className="favorite-button"
          onClick={() => setFavorite(!favorite)}
        >
          <Heart size={20} fill={favorite ? "#ff4757" : "none"} color={favorite ? "#ff4757" : "white"} />
        </button>
        {dish.stock < 10 && (
          <div className="low-stock-badge">Low Stock</div>
        )}
        {dish.tags?.includes('Best Seller') && (
          <div className="best-seller-badge">
            <TrendingUp size={12} />
            Best Seller
          </div>
        )}
      </div>
      <div className="dish-content">
        <div className="dish-header">
          <div>
            <div className="dish-name">{dish.name}</div>
            <div className="dish-category">{dish.category}</div>
          </div>
          <div className="dish-price">₹{dish.price}</div>
        </div>
        <div className="dish-description">{dish.description}</div>
        
        <div className="dish-rating">
          <Star size={14} fill="#FFD700" color="#FFD700" />
          <span className="rating-value">{dish.rating}</span>
          <div className="dish-tags">
            {dish.tags?.map(tag => (
              <span key={tag} className="dish-tag">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="dish-footer">
          <div className={`dish-stock ${dish.stock < 10 ? 'low-stock' : ''}`}>
            {dish.stock > 0 ? `${dish.stock} available` : 'Out of Stock'}
          </div>
          <motion.button 
            onClick={handleAdd}
            disabled={dish.stock === 0 || adding}
            className={`add-button ${dish.stock === 0 ? 'out-of-stock' : ''}`}
            whileHover={{ scale: dish.stock > 0 && !adding ? 1.05 : 1 }}
            whileTap={{ scale: dish.stock > 0 && !adding ? 0.95 : 1 }}
          >
            {adding ? 'Adding...' : dish.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function CartPanel({ open, onClose, onCheckout, user }) {
  const { items, subtotal, deliveryFee, total, updateQty, removeFromCart, clearCart } = useCart();
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  const handleCheckout = async () => {
    setCheckoutProcessing(true);
    await onCheckout();
    setCheckoutProcessing(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="cart-header">
              <div className="cart-title">Your Order ({items.length} items)</div>
              <div className="cart-actions">
                {items.length > 0 && (
                  <button onClick={clearCart} className="clear-cart">
                    <Trash2 size={16} />
                    <span className="clear-text">Clear All</span>
                  </button>
                )}
                <button onClick={onClose} className="close-cart">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="cart-items">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingCart size={48} className="cart-empty-icon" />
                  <div className="cart-empty-title">Your cart is empty</div>
                  <p className="cart-empty-subtitle">Add delicious items from our menu!</p>
                  <button onClick={onClose} className="browse-menu-button">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="cart-items-container">
                  {items.map(it => (
                    <motion.div 
                      key={it.id} 
                      className="cart-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <img src={it.img} alt={it.name} className="cart-item-image" />
                      <div className="cart-item-details">
                        <div className="cart-item-name">{it.name}</div>
                        <div className="cart-item-price">₹{it.price} each</div>
                        <div className="cart-item-controls">
                          <button 
                            onClick={() => updateQty(it.id, Math.max(1, it.qty-1))} 
                            className="quantity-button minus"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="quantity-display">{it.qty}</div>
                          <button 
                            onClick={() => updateQty(it.id, it.qty+1)} 
                            className="quantity-button plus"
                          >
                            <Plus size={14} />
                          </button>
                          <div className="cart-item-total">₹{it.price * it.qty}</div>
                          <button 
                            onClick={() => removeFromCart(it.id)} 
                            className="remove-item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-summary">
                <div className="summary-row">
                  <div className="summary-label">Subtotal</div>
                  <div className="summary-value">₹{subtotal}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">
                    Delivery Fee {subtotal >= 500 && <span className="free-delivery">(FREE)</span>}
                  </div>
                  <div className="summary-value">
                    {subtotal >= 500 ? '₹0' : `₹${deliveryFee}`}
                  </div>
                </div>
                <div className="summary-row total">
                  <div className="summary-label">Total</div>
                  <div className="summary-value">₹{total}</div>
                </div>
                
                {subtotal < RESTAURANT.minOrder && (
                  <div className="min-order-warning">
                    <span>Add ₹{RESTAURANT.minOrder - subtotal} more for minimum order</span>
                  </div>
                )}
                
                <div className="checkout-buttons">
                  <button 
                    disabled={items.length === 0 || subtotal < RESTAURANT.minOrder || checkoutProcessing}
                    onClick={handleCheckout}
                    className="place-order-button"
                  >
                    {checkoutProcessing ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      `Place Order • ₹${total}`
                    )}
                  </button>
                </div>
                
                {!user && (
                  <div className="login-suggestion">
                    <Shield size={16} />
                    <span>Sign in for faster checkout and order tracking</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('login');

  useEffect(() => { 
    if (open) {
      setEmail('');
      setMode('login');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (email.trim()) {
      onLogin({ 
        email: email.trim(), 
        name: email.split('@')[0],
        joinDate: new Date().toISOString()
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="login-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="login-modal"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-header">
              <div className="login-title">
                {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </div>
              <div className="login-subtitle">
                {mode === 'login' 
                  ? 'Sign in to continue your food journey' 
                  : 'Join us for exclusive offers and faster checkout'}
              </div>
            </div>
            
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="login-input" 
              placeholder="you@example.com" 
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            
            <div className="mode-switch">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="switch-button"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
            
            <div className="login-buttons">
              <button onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="signin-button-modal"
                disabled={!email.trim()}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
            
            <div className="login-footer">
              <Shield size={14} />
              Your data is safe with us. This is a demo application.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Notification({ message, type, onClose }) {
  return (
    <motion.div 
      className={`notification ${type}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="notification-content">
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <X size={20} />}
        {type === 'info' && <Award size={20} />}
        <span className="notification-text">{message}</span>
      </div>
      <button onClick={onClose} className="notification-close">
        <X size={16} />
      </button>
    </motion.div>
  );
}

function RestaurantInfo() {
  return (
    <div className="restaurant-info-section">
      <h2 className="section-title">Restaurant Information</h2>
      <div className="restaurant-info-grid">
        <div className="info-card">
          <MapPin className="info-icon" />
          <div>
            <div className="info-title">Address</div>
            <div className="info-value">{RESTAURANT.address}</div>
          </div>
        </div>
        <div className="info-card">
          <Phone className="info-icon" />
          <div>
            <div className="info-title">Phone</div>
            <div className="info-value">{RESTAURANT.phone}</div>
          </div>
        </div>
        <div className="info-card">
          <Clock className="info-icon" />
          <div>
            <div className="info-title">Delivery Time</div>
            <div className="info-value">{RESTAURANT.etaMin}-{RESTAURANT.etaMax} minutes</div>
          </div>
        </div>
        <div className="info-card">
          <Truck className="info-icon" />
          <div>
            <div className="info-title">Delivery Fee</div>
            <div className="info-value">₹{RESTAURANT.deliveryFee} (Free above ₹500)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedSection() {
  return (
    <div className="featured-section">
      <h2 className="section-title">Today's Specials</h2>
      <div className="featured-grid">
        <div className="featured-card" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' }}>
          <div className="featured-content">
            <div className="featured-badge">🔥 Hot Deal</div>
            <h3>50% Off</h3>
            <p>On all pizzas today</p>
          </div>
        </div>
        <div className="featured-card" style={{ background: 'linear-gradient(135deg, #48DBFB 0%, #00BFFF 100%)' }}>
          <div className="featured-content">
            <div className="featured-badge">🍔 New</div>
            <h3>Try New Burgers</h3>
            <p>Freshly launched menu</p>
          </div>
        </div>
        <div className="featured-card" style={{ background: 'linear-gradient(135deg, #FF9FF3 0%, #FDA7DF 100%)' }}>
          <div className="featured-content">
            <div className="featured-badge">🍰 Sweet</div>
            <h3>Free Dessert</h3>
            <p>On orders above ₹800</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  const [user, setUser] = useLocalUser();
  const { items, addToCart, clearCart, totalItems, total } = useCart();

  useEffect(() => {
    let mounted = true;
    fetchMenu().then(res => { 
      if (mounted) {
        setMenu(res || []); 
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, []);

  const filtered = menu.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                         d.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = dish => { 
    addToCart(dish, 1); 
    setNotification({
      message: `Added ${dish.name} to cart!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCheckout = async () => {
    const orderItems = items.map(i => ({ productId: i.id, qty: i.qty }));
    
    setNotification({
      message: 'Processing your order...',
      type: 'info'
    });
    
    try {
      const res = await placeOrder({ 
        restaurantId: RESTAURANT.id, 
        user: user || { guest: true }, 
        items: orderItems, 
        subtotal: total 
      });
      
      if (res && res.ok) {
        setNotification({
          message: `Order #${res.orderId} placed! ETA: ${res.eta} minutes`,
          type: 'success'
        });
        clearCart();
        setCartOpen(false);
      } else {
        throw new Error('Order failed');
      }
    } catch {
      setNotification({
        message: 'Order failed. Please try again.',
        type: 'error'
      });
    }
    
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setNotification({
      message: `Welcome, ${userData.name}!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 3000);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setNotification({
      message: 'Logged out successfully',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoginClick = (isLogout = false) => {
    if (isLogout && user) {
      handleLogout();
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div className="food-delivery-app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          overflow-x: hidden;
        }

        .food-delivery-app {
          width: 110%;
          min-height: 100vh;
          position: relative;
        }

        /* Header Styles */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-wrapper {
          background: white;
          border-radius: 16px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .restaurant-name {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .restaurant-description {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.9);
          margin-top: 0.25rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .delivery-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          font-size: 0.875rem;
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .delivery-time-icon {
          width: 16px;
          height: 16px;
          color: white;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .user-icon {
          width: 20px;
          height: 20px;
          color: white;
        }

        .signin-button, .signout-button {
          padding: 0.75rem 1.5rem;
          border: 2px solid white;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          background: transparent;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .signin-button:hover {
          background: white;
          color: #667eea;
        }

        .signout-button {
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.8);
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }

        .cart-button {
          position: relative;
          padding: 0.75rem;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff6b6b;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 50%;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255,107,107,0.4);
        }

        /* Hero Section */
        .hero {
          position: relative;
          height: 500px;
          background-size: cover;
          background-position: center;
          width: 100%;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
          display: flex;
          align-items: center;
        }

        .hero-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
          width: 100%;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-title .highlight {
          background: linear-gradient(135deg, #ff6b6b, #ffa726);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.5rem;
          opacity: 0.9;
          max-width: 600px;
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .hero-info {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .rating, .eta, .min-order {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.15);
          padding: 1rem 2rem;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          font-weight: 500;
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          width: 100%;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 2px;
        }

        /* Filter Section */
        .filter-section {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s;
        }

        .search-container:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          width: 20px;
          height: 20px;
          color: #94a3b8;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #1e293b;
        }

        .filter-toggle {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          border-color: #667eea;
          color: #667eea;
        }

        /* Category Filter */
        .category-filter-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .category-scroll-wrapper {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }

        .category-scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .categories-list {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem 0;
          min-width: min-content;
        }

        .category-chip {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 50px;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          transition: all 0.3s;
        }

        .category-chip.active {
          background: var(--category-color);
          color: white;
          box-shadow: 0 4px 15px var(--category-color);
        }

        .category-chip:hover:not(.active) {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        /* Menu Grid */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          width: 100%;
        }

        /* Dish Card */
        .dish-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .dish-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .dish-image {
          height: 220px;
          position: relative;
          overflow: hidden;
        }

        .dish-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s;
        }

        .dish-card:hover .dish-image img {
          transform: scale(1.1);
        }

        .favorite-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .favorite-button:hover {
          background: rgba(0,0,0,0.8);
          transform: scale(1.1);
        }

        .low-stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .best-seller-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .dish-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dish-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .dish-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .dish-category {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          margin-top: 0.25rem;
          text-transform: capitalize;
        }

        .dish-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dish-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.6;
          flex: 1;
        }

        .dish-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .rating-value {
          font-weight: 600;
          color: #1e293b;
        }

        .dish-tags {
          margin-left: auto;
          display: flex;
          gap: 0.5rem;
        }

        .dish-tag {
          padding: 0.25rem 0.5rem;
          background: #e0f2fe;
          color: #0369a1;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .dish-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .dish-stock {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .dish-stock.low-stock {
          color: #f59e0b;
          font-weight: 700;
        }

        .add-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 120px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .add-button:disabled, .add-button.out-of-stock {
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
          box-shadow: none;
          cursor: not-allowed;
        }

        /* Restaurant Info */
        .restaurant-info-section {
          margin-bottom: 3rem;
        }

        .restaurant-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .info-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .info-title {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 600;
        }

        /* Featured Section */
        .featured-section {
          margin-bottom: 3rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .featured-card {
          border-radius: 24px;
          padding: 2rem;
          color: white;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .featured-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.1);
          border-radius: 24px;
        }

        .featured-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .featured-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .featured-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .featured-card p {
          opacity: 0.9;
        }

        /* Specials */
        .specials {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 3rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .specials::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
          background-size: cover;
          opacity: 0.1;
        }

        .specials-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .specials-list {
          list-style: none;
          position: relative;
        }

        .specials-list li {
          margin-bottom: 1rem;
          padding-left: 2rem;
          position: relative;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .specials-list li:before {
          content: '🎁';
          position: absolute;
          left: 0;
          font-size: 1.25rem;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 3rem;
          color: #64748b;
          font-size: 0.875rem;
          border-top: 1px solid #e2e8f0;
          margin-top: 3rem;
          background: white;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);
        }

        /* Cart Panel - FIXED */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 450px;
          background: white;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          box-shadow: -20px 0 60px rgba(0, 0, 0, 0.2);
        }

        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .cart-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .cart-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .clear-cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .clear-cart:hover {
          background: #dc2626;
          color: white;
        }

        .clear-text {
          display: inline;
        }

        .close-cart {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #f1f5f9;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .close-cart:hover {
          background: #e2e8f0;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .cart-items-container {
          padding: 1.5rem;
        }

        .cart-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #64748b;
          padding: 3rem 1.5rem;
        }

        .cart-empty-icon {
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .cart-empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .cart-empty-subtitle {
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        .browse-menu-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .browse-menu-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          background: #f8fafc;
          margin-bottom: 0.75rem;
          align-items: center;
        }

        .cart-item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .cart-item-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1e293b;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-item-price {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .quantity-button {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .quantity-button:hover {
          background: #f1f5f9;
          border-color: #667eea;
          color: #667eea;
        }

        .quantity-button.minus {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .quantity-button.plus {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #059669;
        }

        .quantity-display {
          padding: 0 0.75rem;
          font-weight: 600;
          color: #1e293b;
          min-width: 24px;
          text-align: center;
        }

        .cart-item-total {
          margin-left: auto;
          font-weight: 700;
          color: #1e293b;
          font-size: 1rem;
          white-space: nowrap;
        }

        .remove-item {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: #fef2f2;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .remove-item:hover {
          background: #dc2626;
          color: white;
        }

        .cart-summary {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: white;
          position: sticky;
          bottom: 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .summary-label {
          color: #64748b;
          font-size: 0.875rem;
        }

        .free-delivery {
          color: #10b981;
          font-weight: 600;
          margin-left: 0.25rem;
        }

        .summary-value {
          font-weight: 500;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .summary-row.total {
          margin: 1rem 0;
          padding: 1rem 0;
          border-top: 2px solid #e2e8f0;
          border-bottom: 2px solid #e2e8f0;
        }

        .summary-row.total .summary-label,
        .summary-row.total .summary-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .min-order-warning {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          color: #d97706;
          padding: 0.75rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .checkout-buttons {
          margin-top: 1.5rem;
        }

        .place-order-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .place-order-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .place-order-button:disabled {
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        .login-suggestion {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #ecfdf5;
          border-radius: 8px;
          color: #047857;
          font-size: 0.875rem;
        }

        /* Login Modal */
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .login-modal {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* Notification */
        .notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: white;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-width: 300px;
          z-index: 2001;
          border-left: 4px solid #10b981;
        }

        .notification.error {
          border-left-color: #ef4444;
        }

        .notification.info {
          border-left-color: #3b82f6;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .notification-text {
          font-weight: 500;
        }

        .notification-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-close:hover {
          background: #f1f5f9;
        }

        /* Loading & No Results */
        .loading, .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design - FIXED FOR CART */
        @media (max-width: 768px) {
          .header-container {
            padding: 0.75rem 1rem;
          }
          
          .restaurant-name {
            font-size: 1.25rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .hero-info {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .rating, .eta, .min-order {
            width: 100%;
            justify-content: center;
          }
          
          .search-bar {
            flex-direction: column;
          }
          
          .filter-toggle {
            width: 100%;
            justify-content: center;
          }
          
          .menu-grid {
            grid-template-columns: 1fr;
          }
          
          .featured-grid {
            grid-template-columns: 1fr;
          }
          
          .restaurant-info-grid {
            grid-template-columns: 1fr;
          }
          
          /* Mobile cart fixes */
          .cart-sidebar {
            max-width: 100%;
            width: 100%;
          }
          
          .cart-item {
            flex-direction: row;
            align-items: center;
          }
          
          .cart-item-image {
            width: 60px;
            height: 60px;
          }
          
          .cart-item-details {
            flex: 1;
          }
          
          .cart-item-controls {
            flex-wrap: nowrap;
          }
          
          .cart-item-total {
            margin-left: 0.5rem;
            font-size: 0.875rem;
          }
          
          .clear-text {
            display: none;
          }
          
          .clear-cart {
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .header-actions {
            gap: 0.75rem;
          }
          
          .delivery-time, .user-info {
            display: none;
          }
          
          .hero {
            height: 400px;
          }
          
          .hero-content {
            padding: 1.5rem;
          }
          
          .specials {
            padding: 1.5rem;
          }
          
          .specials-title {
            font-size: 1.5rem;
          }
          
          .dish-card {
            margin: 0;
          }
          
          /* Mobile cart specific fixes */
          .cart-item {
            padding: 0.75rem;
          }
          
          .quantity-button {
            width: 28px;
            height: 28px;
          }
          
          .quantity-display {
            padding: 0 0.5rem;
            font-size: 0.875rem;
          }
          
          .cart-item-name {
            font-size: 0.875rem;
          }
          
          .cart-item-price {
            font-size: 0.75rem;
          }
          
          .cart-item-total {
            font-size: 0.75rem;
          }
          
          .notification {
            min-width: auto;
            width: calc(100% - 2rem);
            right: 1rem;
            left: 1rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1025px) and (max-width: 1400px) {
          .menu-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .hidden-sm {
          display: none;
        }

        @media (min-width: 768px) {
          .hidden-sm {
            display: block;
          }
        }
      `}</style>
      
      <Header 
        onToggleCart={() => setCartOpen(v => !v)} 
        onOpenLogin={handleLoginClick} 
        user={user} 
        cartCount={totalItems} 
      />
      
      <Hero />
      
      <main className="main-content">
        <FeaturedSection />
        
        <RestaurantInfo />
        
        <FilterBar 
          search={search} 
          setSearch={setSearch} 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <h2 className="section-title">Our Menu</h2>
        <div className="menu-grid">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <div>Loading delicious menu...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              No dishes found. Try a different search or category.
            </div>
          ) : (
            filtered.map(dish => (
              <DishCard key={dish.id} dish={dish} onAdd={handleAdd} />
            ))
          )}
        </div>
        
        <section className="specials">
          <h2 className="specials-title">
            <Award size={24} />
            Special Offers & Benefits
          </h2>
          <ul className="specials-list">
            {RESTAURANT.specials.map((special, index) => (
              <li key={index}>{special}</li>
            ))}
          </ul>
        </section>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} {RESTAURANT.name} — Premium Food Delivery Experience</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.75rem' }}>
            This is a demonstration application. All food images are from Unsplash.
          </p>
        </footer>
      </main>
      
      <CartPanel 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={handleCheckout} 
        user={user} 
      />
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onLogin={handleLogin}
      />
      
      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FoodDeliveryAppWithProvider() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}