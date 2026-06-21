import db from '../config/db.js';

export const createAuditLog = async (adminUserId, action, orderId, details) => {
  try {
    await db.run(
      'INSERT INTO admin_audit_log (admin_user_id, action, order_id, details, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [adminUserId, action, orderId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
