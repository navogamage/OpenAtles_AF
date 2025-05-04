// favorites.js - Modified to use localStorage instead of API
const FAVORITES_STORAGE_KEY = 'userFavorites';

// Get favorites from localStorage
export const getFavorites = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return [];
    
    const { _id } = JSON.parse(userInfo);
    const allFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || {};
    
    return allFavorites[_id] || [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

// Add a country to favorites
export const addToFavorites = (country) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) throw new Error('User not authenticated');
    
    const { _id } = JSON.parse(userInfo);
    const allFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || {};
    
    // Initialize user's favorites array if it doesn't exist
    if (!allFavorites[_id]) {
      allFavorites[_id] = [];
    }
    
    // Check if the country is already in favorites
    if (!allFavorites[_id].some(fav => fav.cca3 === country.cca3)) {
      allFavorites[_id].push(country);
    }
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
    return allFavorites[_id];
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a country from favorites
export const removeFromFavorites = (countryCode) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) throw new Error('User not authenticated');
    
    const { _id } = JSON.parse(userInfo);
    const allFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || {};
    
    if (allFavorites[_id]) {
      allFavorites[_id] = allFavorites[_id].filter(country => country.cca3 !== countryCode);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
    }
    
    return allFavorites[_id] || [];
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Clear all favorites for a user (useful when logging out)
// Note: We keep this function but DON'T use it during logout
export const clearFavorites = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;
    
    const { _id } = JSON.parse(userInfo);
    const allFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || {};
    
    if (allFavorites[_id]) {
      delete allFavorites[_id];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
    }
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};