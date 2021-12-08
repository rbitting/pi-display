const PROD_IP = 'http://localhost:3000/';

// Absolute path if production, otherwise relative
export const domain = process.env.NODE_ENV === 'production' ? PROD_IP : '';
