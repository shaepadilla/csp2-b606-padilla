// test.js - Run with: node test.js
console.log('=== TESTING ALL IMPORTS ===\n');

try {
    // Test auth
    const auth = require('./auth');
    console.log('✅ auth.js loaded');
    console.log('   - verify:', typeof auth.verify);
    console.log('   - verifyAdmin:', typeof auth.verifyAdmin);
    console.log('   - createAccessToken:', typeof auth.createAccessToken);
    console.log('   - errorHandler:', typeof auth.errorHandler);
} catch(e) {
    console.log('❌ auth.js error:', e.message);
}

try {
    // Test models
    const User = require('./models/User');
    console.log('✅ User model loaded');
    
    const Product = require('./models/Product');
    console.log('✅ Product model loaded');
    
    const Cart = require('./models/Cart');
    console.log('✅ Cart model loaded');
    
    const Order = require('./models/Order');
    console.log('✅ Order model loaded');
} catch(e) {
    console.log('❌ Model error:', e.message);
}

try {
    // Test controllers
    const userController = require('./controllers/user');
    console.log('✅ userController loaded, functions:', Object.keys(userController).length);
    
    const productController = require('./controllers/product');
    console.log('✅ productController loaded, functions:', Object.keys(productController).length);
    
    const cartController = require('./controllers/cart');
    console.log('✅ cartController loaded, functions:', Object.keys(cartController).length);
    
    const orderController = require('./controllers/order');
    console.log('✅ orderController loaded, functions:', Object.keys(orderController).length);
} catch(e) {
    console.log('❌ Controller error:', e.message);
    console.log('Error details:', e);
}

try {
    // Test routes
    const userRoutes = require('./routes/user');
    console.log('✅ userRoutes loaded:', typeof userRoutes);
    
    const productRoutes = require('./routes/product');
    console.log('✅ productRoutes loaded:', typeof productRoutes);
    
    const cartRoutes = require('./routes/cart');
    console.log('✅ cartRoutes loaded:', typeof cartRoutes);
    
    const orderRoutes = require('./routes/order');
    console.log('✅ orderRoutes loaded:', typeof orderRoutes);
} catch(e) {
    console.log('❌ Route error:', e.message);
    console.log('Error details:', e);
}

console.log('\n=== TEST COMPLETE ===');