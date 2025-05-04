import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../api/favorites';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch user's favorites when component mounts or user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }
      
      setLoading(true);
      try {
        // This now gets favorites from localStorage based on user ID
        const data = getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);

  // Add a country to favorites
  const addFavorite = async (country) => {
    if (!user) return;
    
    try {
      // This now saves to localStorage with user ID separation
      const updatedFavorites = addToFavorites(country);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  // Remove a country from favorites
  const removeFavorite = async (countryCode) => {
    if (!user) return;
    
    try {
      // This now removes from localStorage with user ID separation
      const updatedFavorites = removeFromFavorites(countryCode);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    return favorites.some(country => country.cca3 === countryCode);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      addFavorite,
      removeFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;