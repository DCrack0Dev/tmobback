import db from '../config/db.js';

export const getStats = async (req, res) => {
  try {
    const totalOrders = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await db.query('SELECT SUM(total_amount) as sum FROM orders WHERE status IN ("paid", "shipped", "delivered")');
    const pendingOrders = await db.query('SELECT COUNT(*) as count FROM orders WHERE status IN ("pending_payment", "payment_submitted")');
    const totalProducts = await db.query('SELECT COUNT(*) as count FROM products');
    
    // Calculate 30 days ago in JS for compatibility
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    
    const recentOrders = await db.query('SELECT created_at, total_amount FROM orders WHERE created_at >= ? ORDER BY created_at', [cutoffDate]);
    
    // Process monthly data in JS for compatibility with both SQLite and MySQL
    const monthlyData = {};
    recentOrders.forEach(order => {
      const date = new Date(order.created_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[month]) {
        monthlyData[month] = { month, count: 0, revenue: 0 };
      }
      monthlyData[month].count += 1;
      monthlyData[month].revenue += parseFloat(order.total_amount);
    });

    const monthlyOrders = Object.values(monthlyData);

    res.json({
      total_orders: totalOrders[0].count,
      total_revenue: totalRevenue[0].sum || 0,
      pending_orders: pendingOrders[0].count,
      total_products: totalProducts[0].count,
      monthly_data: monthlyOrders
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const orders = await db.query(query, params);
    const processedOrders = orders.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address)
    }));
    res.json(processedOrders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const orderId = req.params.id;
    await db.run('UPDATE orders SET status = "paid" WHERE id = ?', [orderId]);
    res.json({ message: 'Payment verified' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE role = "customer" ORDER BY created_at DESC');
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);
    const processedOrders = orders.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address)
    }));
    res.json(processedOrders);
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
