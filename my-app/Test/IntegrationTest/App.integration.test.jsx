// my-app/src/Test/IntegrationTest/App.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../../App';

// Mock the contexts to provide test values
jest.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  AuthContext: {
    Provider: ({ value, children }) => (
      <div data-testid="auth-context-mock">{children}</div>
    ),
  },
  useContext: () => ({
    user: { id: 'test-user', name: 'Test User' },
    loading: false,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
}));

jest.mock('../../context/FavoritesContext', () => ({
  FavoritesProvider: ({ children }) => children,
}));

// Mock components to simplify testing
jest.mock('../../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../../pages/Home', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../../components/CountryDetail', () => () => (
  <div data-testid="country-detail">Country Detail</div>
));
jest.mock('../../components/auth/Login', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('../../components/auth/Register', () => () => (
  <div data-testid="register-page">Register Page</div>
));
jest.mock('../../components/auth/Profile', () => () => (
  <div data-testid="profile-page">Profile Page</div>
));
jest.mock('../../pages/Favorites', () => () => (
  <div data-testid="favorites-page">Favorites Page</div>
));

// Setup MSW server to mock API responses
const server = setupServer(
  rest.get('https://restcountries.com/v3.1/all', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: { common: 'Germany', official: 'Federal Republic of Germany' },
          cca3: 'DEU',
          flags: { png: 'https://example.com/germany.png', alt: 'Flag of Germany' },
          population: 83000000,
          region: 'Europe',
          capital: ['Berlin'],
        },
        {
          name: { common: 'United States', official: 'United States of America' },
          cca3: 'USA',
          flags: { png: 'https://example.com/usa.png', alt: 'Flag of USA' },
          population: 328000000,
          region: 'Americas',
          capital: ['Washington, D.C.'],
        },
      ])
    );
  }),
  rest.get('https://restcountries.com/v3.1/alpha/:code', (req, res, ctx) => {
    const { code } = req.params;
    
    if (code === 'DEU') {
      return res(
        ctx.json([
          {
            name: { common: 'Germany', official: 'Federal Republic of Germany' },
            cca3: 'DEU',
            flags: { png: 'https://example.com/germany.png', alt: 'Flag of Germany' },
            population: 83000000,
            region: 'Europe',
            capital: ['Berlin'],
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            languages: { deu: 'German' },
            borders: ['FRA', 'POL', 'CZE', 'AUT', 'CHE', 'LUX', 'BEL', 'NLD', 'DNK'],
          },
        ])
      );
    }
    
    return res(ctx.status(404));
  })
);

// Start and cleanup the MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper render function that wraps App in the required router context
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App Integration Tests', () => {
  test('renders the home page by default', async () => {
    renderWithRouter();
    
    // Should display the navbar on every page
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Should display the home page when navigating to root
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  test('navigates to country detail page', async () => {
    renderWithRouter('/country/DEU');
    
    await waitFor(() => {
      expect(screen.getByTestId('country-detail')).toBeInTheDocument();
    });
  });

  test('renders login page', async () => {
    renderWithRouter('/login');
    
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  test('renders register page', async () => {
    renderWithRouter('/register');
    
    await waitFor(() => {
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });

  test('protected routes redirect to login when not authenticated', async () => {
    // Override the mock to simulate unauthenticated user
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      user: null,
      loading: false,
    }));

    renderWithRouter('/profile');
    
    // Should be redirected to the login page
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    // Restore the original implementation
    jest.restoreAllMocks();
  });

  test('authenticated users can access protected routes', async () => {
    // Override the mock to ensure authenticated user
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      user: { id: 'test-user' },
      loading: false,
    }));

    renderWithRouter('/profile');
    
    // Should show the profile page for authenticated users
    await waitFor(() => {
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    // Restore the original implementation
    jest.restoreAllMocks();
  });

  test('authenticated users can access favorites page', async () => {
    // Override the mock to ensure authenticated user
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      user: { id: 'test-user' },
      loading: false,
    }));

    renderWithRouter('/favorites');
    
    // Should show the favorites page for authenticated users
    await waitFor(() => {
      expect(screen.getByTestId('favorites-page')).toBeInTheDocument();
    });

    // Restore the original implementation
    jest.restoreAllMocks();
  });
});