// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://rsa-web-app-production.up.railway.app'
  : 'http://localhost:8080';

export { API_BASE_URL };