import db from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import { validationResult } from 'express-validator';

export const getProducts = async (req, res) => {
  try {
    const { search, brand, minPrice, maxPrice, sort = 'newest', page = 1, limit = 20, is_featured } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, 
             AVG(r.rating) as average_rating, 
             COUNT(r.id) as review_count 
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (brand) {
      query += ' AND p.brand = ?';
      params.push(brand);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (is_featured !== undefined) {
      query += ' AND p.is_featured = ?';
      params.push(is_featured === 'true' ? 1 : 0);
    }

    query += ' GROUP BY p.id';

    const sortFields = {
      'price_asc': 'p.price ASC',
      'price_desc': 'p.price DESC',
      'newest': 'p.created_at DESC'
    };
    query += ` ORDER BY ${sortFields[sort] || sortFields['newest']}`;

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    if (search) {
      countQuery += ' AND (name LIKE ? OR brand LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (brand) {
      countQuery += ' AND brand = ?';
      countParams.push(brand);
    }
    if (minPrice) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }
    if (is_featured !== undefined) {
      countQuery += ' AND is_featured = ?';
      countParams.push(is_featured === 'true' ? 1 : 0);
    }
    const countResult = await db.query(countQuery, countParams);

    // TEMP: Return raw data without JSON parsing
    res.json({
      products: products.map(p => ({
        ...p,
        images: [], // Hardcoded empty for now
        specifications: {}, // Hardcoded empty for now
        average_rating: parseFloat(p.average_rating) || 0,
        review_count: parseInt(p.review_count) || 0
      })),
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const products = await db.query(
      `SELECT p.*, 
              AVG(r.rating) as average_rating, 
              COUNT(r.id) as review_count 
       FROM products p 
       LEFT JOIN reviews r ON p.id = r.product_id 
       WHERE p.id = ?
       GROUP BY p.id`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];
    // TEMP: Return raw data without JSON parsing
    res.json({
      ...product,
      images: [], // Hardcoded empty for now
      specifications: {}, // Hardcoded empty for now
      average_rating: parseFloat(product.average_rating) || 0,
      review_count: parseInt(product.review_count) || 0
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, brand, description, price, stock, specifications, is_featured } = req.body;

    const result = await db.run(
      'INSERT INTO products (name, brand, description, price, stock, specifications, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, brand, description, parseFloat(price), parseInt(stock), JSON.stringify(specifications || {}), is_featured ? 1 : 0]
    );

    res.status(201).json({ id: result.lastID, name, brand, description, price, stock, specifications: specifications || {}, is_featured: is_featured || false });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, brand, description, price, stock, specifications, is_featured, images } = req.body;

    await db.run(
      'UPDATE products SET name = ?, brand = ?, description = ?, price = ?, stock = ?, specifications = ?, is_featured = ?, images = ? WHERE id = ?',
      [name, brand, description, parseFloat(price), parseInt(stock), JSON.stringify(specifications || {}), is_featured ? 1 : 0, JSON.stringify(images || []), req.params.id]
    );

    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    const products = await db.query('SELECT images FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingImages = products[0].images ? JSON.parse(products[0].images) : [];
    const newImages = [...existingImages, ...imageUrls];

    await db.run('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(newImages), req.params.id]);

    res.json({ images: newImages });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
