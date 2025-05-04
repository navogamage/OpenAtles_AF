import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryCard from '../../src/components/CountryCard';
import { AuthContext } from '../../src/context/AuthContext';
import { FavoritesContext } from '../../src/context/FavoritesContext';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock country data
const mockCountry = {
  name: {
    common: 'Finland',
    official: 'Republic of Finland'
  },
  flags: {
    svg: 'https://example.com/finland-flag.svg'
  },
  cca3: 'FIN',
  region: 'Europe',
  subregion: 'Northern Europe',
  capital: ['Helsinki'],
  population: 5530719
};

// Mock context values
const mockAuthContext = {
  user: { id: 'user1' } // Logged in user
};

const mockAuthContextNoUser = {
  user: null // No logged in user
};

const mockFavoritesContext = {
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  isFavorite: jest.fn()
};

// Test wrapper components
const renderWithContexts = (ui, { authContext, favoritesContext }) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authContext}>
        <FavoritesContext.Provider value={favoritesContext}>
          {ui}
        </FavoritesContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('CountryCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders country information correctly', () => {
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Check country name and other details are rendered
    expect(screen.getByText('Finland')).toBeInTheDocument();
    expect(screen.getByText('Republic of Finland')).toBeInTheDocument();
    expect(screen.getByText(/Europe · Northern Europe/)).toBeInTheDocument();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
    expect(screen.getByText('5,530,719')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    
    // Check flag alt text
    expect(screen.getByAltText('Flag of Finland')).toBeInTheDocument();
  });

  test('navigates to country detail page when clicked', () => {
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Click on the card
    const cardActionArea = screen.getByText('Finland').closest('button');
    fireEvent.click(cardActionArea);
    
    // Check navigation was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/country/FIN');
  });

  test('displays heart icon when logged in', () => {
    mockFavoritesContext.isFavorite.mockReturnValue(false);
    
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Look for the empty heart (not favorite)
    expect(screen.getByText('🤍')).toBeInTheDocument();
  });

  test('does not display heart icon when not logged in', () => {
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContextNoUser, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Heart icon should not be present
    expect(screen.queryByText('🤍')).not.toBeInTheDocument();
    expect(screen.queryByText('❤️')).not.toBeInTheDocument();
  });

  test('adds country to favorites when heart is clicked', () => {
    mockFavoritesContext.isFavorite.mockReturnValue(false);
    
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Find and click the heart icon
    const heartIcon = screen.getByText('🤍');
    fireEvent.click(heartIcon);
    
    // Check favorite function was called
    expect(mockFavoritesContext.addFavorite).toHaveBeenCalledWith(mockCountry);
    expect(mockFavoritesContext.removeFavorite).not.toHaveBeenCalled();
  });

  test('removes country from favorites when filled heart is clicked', () => {
    mockFavoritesContext.isFavorite.mockReturnValue(true);
    
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Find and click the filled heart icon
    const heartIcon = screen.getByText('❤️');
    fireEvent.click(heartIcon);
    
    // Check remove favorite function was called
    expect(mockFavoritesContext.removeFavorite).toHaveBeenCalledWith('FIN');
    expect(mockFavoritesContext.addFavorite).not.toHaveBeenCalled();
  });

  test('clicking favorite button does not trigger navigation', () => {
    mockFavoritesContext.isFavorite.mockReturnValue(true);
    
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Find and click the heart icon
    const heartIcon = screen.getByText('❤️');
    fireEvent.click(heartIcon);
    
    // Navigation should not be called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays correct continent emoji for Europe', () => {
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // The Europe emoji is 🌍
    const avatarContainer = screen.getByText('🌍');
    expect(avatarContainer).toBeInTheDocument();
  });

  test('displays formatted population with commas', () => {
    renderWithContexts(
      <CountryCard country={mockCountry} />,
      { 
        authContext: mockAuthContext, 
        favoritesContext: mockFavoritesContext 
      }
    );

    // Check formatted population
    expect(screen.getByText('5,530,719')).toBeInTheDocument();
  });
});