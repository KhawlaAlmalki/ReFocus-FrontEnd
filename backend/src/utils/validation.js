// src/utils/validation.js

export const validatePassword = (password) => {
  // SIMPLIFIED: Only require 6+ characters
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < 6) {
    return { isValid: false, errors: ['Password must be at least 6 characters'] };
  }

  if (password.length > 128) {
    return { isValid: false, errors: ['Password must not exceed 128 characters'] };
  }

  return { isValid: true, errors: [] };
};

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  return { isValid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' };
  }

  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '')
    .trim();
};