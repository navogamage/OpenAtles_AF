import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CountryDetail from '../../src/components/CountryDetail';
import { AuthContext } from '../../src/context/AuthContext';
import { FavoritesContext } from '../../src/context/FavoritesContext';
import { getCountryByCode } from '../../src/api/countries';

// Mock the API call
jest.mock('../../src/api/countries');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ countryCode: 'USA' })
}));

// Sample country data for tests
const mockCountry = {
  name: {
    common: 'United States',
    nativeName: {
      eng: {
        common: 'United States of America'
      }
    }
  },
  cca3: 'USA',
  capital: ['Washington, D.C.'],
  region: 'Americas',
  subregion: 'North America',
  population: 331002651,
  flags: {
    svg: 'https://flagcdn.com/us.svg',
    png: 'https://flagcdn.com/w320/us.png',
  },
  tld: ['.us'],
  currencies: {
    USD: {
      name: 'United States dollar',
      symbol: '$'
    }
  },
  languages: {
    eng: 'English'
  },
  borders: ['CAN', 'MEX'],
  flag: '🇺🇸'
};

// Setup mocked context providers
const mockAuthContext = {
  user: { id: '123', name: 'Test User' }
};

const mockFavoritesContext = {
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  isFavorite: jest.fn()
};

const renderWithProviders = (ui, { authValue = mockAuthContext, favoritesValue = mockFavoritesContext } = {}) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <FavoritesContext.Provider value={favoritesValue}>
        <MemoryRouter initialEntries={['/country/USA']}>
          <Routes>
            <Route path="/country/:countryCode" element={ui} />
          </Routes>
        </MemoryRouter>
      </FavoritesContext.Provider>
    </AuthContext.Provider>
  );
};

describe('CountryDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    getCountryByCode.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockCountry), 100)));
    
    renderWithProviders(<CountryDetail />);
    
    expect(screen.getByText('Loading country information...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays country data after loading', async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Americas • North America')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('POPULATION')).toBeInTheDocument();
    expect(screen.getByText('331,002,651')).toBeInTheDocument();
    expect(screen.getByText('CAPITAL')).toBeInTheDocument();
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('United States dollar')).toBeInTheDocument();
    expect(screen.getByText('BORDER COUNTRIES:')).toBeInTheDocument();
    expect(screen.getByText('CAN')).toBeInTheDocument();
    expect(screen.getByText('MEX')).toBeInTheDocument();
  });

  test('shows error state when country is not found', async () => {
    getCountryByCode.mockResolvedValue(null);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Country not found')).toBeInTheDocument();
    });
    
    expect(screen.getByText('We couldn\'t find any information for the requested country.')).toBeInTheDocument();
    
    const returnButton = screen.getByText('Return Home');
    fireEvent.click(returnButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates back when back button is clicked', async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Back to Countries');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('adds country to favorites when add button is clicked', async () => {
    mockFavoritesContext.isFavorite.mockReturnValue(false);
    
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Add to Favorites');
    fireEvent.click(addButton);
    expect(mockFavoritesContext.addFavorite).toHaveBeenCalledWith(mockCountry);
  });

  test('removes country from favorites when remove button is clicked', async () => {
    mockFavoritesContext.isFavorite.mockReturnValue(true);
    
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    const removeButton = screen.getByText('Remove from Favorites');
    fireEvent.click(removeButton);
    expect(mockFavoritesContext.removeFavorite).toHaveBeenCalledWith('USA');
  });

  test('displays native name when available', async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    expect(screen.getByText('NATIVE NAME')).toBeInTheDocument();
    expect(screen.getByText('United States of America')).toBeInTheDocument();
  });

  test('navigates to border country when border chip is clicked', async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    const borderChip = screen.getByText('CAN');
    fireEvent.click(borderChip);
    expect(mockNavigate).toHaveBeenCalledWith('/country/CAN');
  });

  test('does not show favorite buttons when user is not logged in', async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    
    renderWithProviders(<CountryDetail />, { 
      authValue: { user: null }
    });
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Add to Favorites')).not.toBeInTheDocument();
    expect(screen.queryByText('Remove from Favorites')).not.toBeInTheDocument();
  });
});