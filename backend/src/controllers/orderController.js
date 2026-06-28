import db from '../config/db.js';
import { validationResult } from 'express-validator';
import { getCachedRates } from '../services/exchangeRateService.js';
import { sendOrderConfirmation, sendStatusUpdate } from '../services/emailService.js';
import { generateQRCodeDataUrl } from '../services/qrService.js';
import bcrypt from 'bcrypt';

export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shipping_address, guest_name, guest_email, guest_phone, create_account, password } = req.body;
    const userId = req.user?.id || null;

    const orderResult = await db.transaction(async (tx) => {
      let finalUserId = userId;
      if (create_account && !userId && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await tx.run(
          'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
          [guest_name, guest_email, hashedPassword, guest_phone, 'customer']
        );
        finalUserId = userResult.lastID;
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const products = await tx.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
        if (products.length === 0) {
          throw new Error(`Product ${item.product_id} not found`);
        }
        const product = products[0];
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        totalAmount += product.price * item.quantity;
        orderItems.push({ ...item, price: product.price });

        await tx.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      }

      const rates = getCachedRates();
      const cryptoAmount = totalAmount / rates.usdtToUsd;

      const orderInsertResult = await tx.run(
        'INSERT INTO orders (user_id, guest_name, guest_email, guest_phone, total_amount, crypto_amount, exchange_rate_used, wallet_address, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          finalUserId,
          guest_name,
          guest_email,
          guest_phone,
          totalAmount,
          cryptoAmount,
          rates.usdtToUsd,
          process.env.USDT_WALLET_ADDRESS,
          JSON.stringify(shipping_address)
        ]
      );

      const orderId = orderInsertResult.lastID;

      for (const item of orderItems) {
        await tx.run(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      if (finalUserId) {
        await tx.run('DELETE FROM carts WHERE user_id = ?', [finalUserId]);
      }

      return { orderId, finalUserId };
    });

    const qrCode = await generateQRCodeDataUrl(process.env.USDT_WALLET_ADDRESS);

    const order = await db.query('SELECT * FROM orders WHERE id = ?', [orderResult.orderId]);

    try {
      await sendOrderConfirmation(order[0]);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.status(201).json({
      ...order[0],
      shipping_address: JSON.parse(order[0].shipping_address),
      qr_code: qrCode
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    let query = 'SELECT * FROM orders';
    const params = [];

    if (req.user?.role !== 'admin') {
      query += ' WHERE user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY created_at DESC';

    const orders = await db.query(query, params);

    res.json(
      orders.map(order => ({
        ...order,
        shipping_address: JSON.parse(order.shipping_address)
      }))
    );
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Allow access if:
    // 1. User is admin
    // 2. User is the order owner
    // 3. It's a guest order (no user_id) - no auth needed
    if (
      req.user?.role !== 'admin' && 
      order.user_id !== null && 
      order.user_id !== req.user?.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const items = await db.query(
      'SELECT oi.*, p.name, p.images FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [order.id]
    );

    res.json({
      ...order,
      shipping_address: JSON.parse(order.shipping_address),
      items: items.map(i => ({ ...i, images: i.images ? JSON.parse(i.images) : [] }))
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitTransactionHash = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transaction_hash } = req.body;

    const orders = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (
      req.user?.role !== 'admin' && 
      orders[0].user_id !== null && 
      orders[0].user_id !== req.user?.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.run(
      'UPDATE orders SET transaction_hash = ?, status = ? WHERE id = ?',
      [transaction_hash, 'payment_submitted', req.params.id]
    );

    await sendStatusUpdate(orders[0], 'payment_submitted');

    res.json({ message: 'Transaction hash submitted' });
  } catch (error) {
    console.error('Submit tx hash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
