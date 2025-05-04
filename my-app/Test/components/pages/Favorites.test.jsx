import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Favorites from '../../../src/pages/Favorites';
import { FavoritesContext } from '../../../src/context/FavoritesContext';
import { AuthContext } from '../../../src/context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock CountryCard component
jest.mock('../../../src/components/CountryCard', () => ({
  __esModule: true,
  default: ({ country }) => (
    <div data-testid="country-card">
      {country.name.common}
    </div>
  ),
}));

// Sample data for tests
const mockFavorites = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    flags: { png: 'usa-flag.png' },
  },
  {
    cca3: 'CAN',
    name: { common: 'Canada' },
    flags: { png: 'canada-flag.png' },
  },
];

// Test wrapper to provide all required contexts
const renderWithProviders = (
  ui,
  {
    favoritesProviderProps = { favorites: [], loading: false },
    authProviderProps = { user: null, loading: false },
    theme = createTheme(),
    ...renderOptions
  } = {}
) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authProviderProps}>
          <FavoritesContext.Provider value={favoritesProviderProps}>
            {ui}
          </FavoritesContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>,
    renderOptions
  );
};

describe('Favorites Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to login when user is not authenticated', async () => {
    renderWithProviders(<Favorites />);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays loading state when loading favorites', () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: [], loading: true }
    });
    
    expect(screen.getByText('Loading your favorites...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays empty state when no favorites', () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: [], loading: false }
    });
    
    expect(screen.getByText('You haven\'t added any favorites yet')).toBeInTheDocument();
    expect(screen.getByText('Start Exploring')).toBeInTheDocument();
  });

  test('displays list of favorite countries', () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: mockFavorites, loading: false }
    });
    
    expect(screen.getByText('My Favorite Countries')).toBeInTheDocument();
    expect(screen.getByText('You have 2 favorite countries')).toBeInTheDocument();
    
    const countryCards = screen.getAllByTestId('country-card');
    expect(countryCards).toHaveLength(2);
    expect(countryCards[0]).toHaveTextContent('United States');
    expect(countryCards[1]).toHaveTextContent('Canada');
  });

  test('shows singular text when only one favorite country', () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: [mockFavorites[0]], loading: false }
    });
    
    expect(screen.getByText('You have 1 favorite country')).toBeInTheDocument();
  });

  test('navigates to home page when "Explore All Countries" button is clicked', async () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: mockFavorites, loading: false }
    });
    
    const exploreButton = screen.getByText('Explore All Countries');
    await userEvent.click(exploreButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to home page when "Start Exploring" button is clicked in empty state', async () => {
    renderWithProviders(<Favorites />, {
      authProviderProps: { user: { id: '1', name: 'Test User' }, loading: false },
      favoritesProviderProps: { favorites: [], loading: false }
    });
    
    const startExploringButton = screen.getByText('Start Exploring');
    await userEvent.click(startExploringButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders nothing while checking authentication', () => {
    const { container } = renderWithProviders(<Favorites />, {
      authProviderProps: { user: null, loading: true }
    });
    
    expect(container.firstChild).toBeNull();
  });
  
  test('handles auth state change after initial load', async () => {
    const { rerender } = renderWithProviders(<Favorites />, {
      authProviderProps: { user: null, loading: true }
    });
    
    // Should initially render nothing
    expect(screen.queryByText('My Favorite Countries')).not.toBeInTheDocument();
    
    // Update auth context to simulate finished loading without a user
    rerender(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <AuthContext.Provider value={{ user: null, loading: false }}>
            <FavoritesContext.Provider value={{ favorites: [], loading: false }}>
              <Favorites />
            </FavoritesContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    );
    
    // Should redirect to login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    
    // Update auth context to simulate user logging in
    rerender(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <AuthContext.Provider value={{ user: { id: '1' }, loading: false }}>
            <FavoritesContext.Provider value={{ favorites: mockFavorites, loading: false }}>
              <Favorites />
            </FavoritesContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    );
    
    // Should now show favorites
    await waitFor(() => {
      expect(screen.getByText('My Favorite Countries')).toBeInTheDocument();
      expect(screen.getAllByTestId('country-card')).toHaveLength(2);
    });
  });
});