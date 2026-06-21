import db from '../config/db.js';

export const getCart = async (req, res) => {
  try {
    const cartItems = await db.query(
      'SELECT c.*, p.name, p.price, p.images, p.stock FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );

    res.json(
      cartItems.map(item => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : []
      }))
    );
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    const existing = await db.query(
      'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      await db.run(
        'UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      await db.run(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    await db.run(
      'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, req.user.id, req.params.productId]
    );

    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await db.run(
      'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
