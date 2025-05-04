import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../../src/components/auth/Register';
import { register } from '../../../src/api/auth';
import { AuthContext } from '../../../src/context/AuthContext';

// Mock the required modules and hooks
jest.mock('../../../src/api/auth', () => ({
  register: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper to provide context
const renderWithAuthContext = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logout: jest.fn(),
          user: null,
          isAuthenticated: false,
          ...providerProps,
        }}
      >
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>,
    renderOptions
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form correctly', () => {
    renderWithAuthContext(<Register />);
    
    expect(screen.getByText('Join Us Today')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('displays error when passwords do not match', async () => {
    renderWithAuthContext(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  test('handles successful registration', async () => {
    const mockLoginFn = jest.fn();
    const userData = { user: { id: '1', name: 'Test User', email: 'test@example.com' }, token: 'test-token' };
    
    register.mockResolvedValueOnce(userData);
    
    renderWithAuthContext(<Register />, {
      providerProps: { login: mockLoginFn }
    });
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
      expect(mockLoginFn).toHaveBeenCalledWith(userData);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    register.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    renderWithAuthContext(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('handles registration error with no response data', async () => {
    register.mockRejectedValueOnce({});
    
    renderWithAuthContext(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    renderWithAuthContext(<Register />);
    
    // Password field initially shows as password (hidden)
    const passwordField = screen.getByLabelText(/^Password/i);
    expect(passwordField).toHaveAttribute('type', 'password');
    
    // Click visibility toggle button
    const passwordToggleButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(passwordToggleButtons[0]);
    
    // Password should now be visible
    expect(passwordField).toHaveAttribute('type', 'text');
    
    // Toggle back to hidden
    fireEvent.click(passwordToggleButtons[0]);
    expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('toggles confirm password visibility', () => {
    renderWithAuthContext(<Register />);
    
    // Confirm password field initially shows as password (hidden)
    const confirmPasswordField = screen.getByLabelText(/Confirm Password/i);
    expect(confirmPasswordField).toHaveAttribute('type', 'password');
    
    // Click visibility toggle button
    const passwordToggleButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(passwordToggleButtons[1]);
    
    // Confirm password should now be visible
    expect(confirmPasswordField).toHaveAttribute('type', 'text');
    
    // Toggle back to hidden
    fireEvent.click(passwordToggleButtons[1]);
    expect(confirmPasswordField).toHaveAttribute('type', 'password');
  });

  test('validates form fields are required', async () => {
    renderWithAuthContext(<Register />);
    
    // Try submitting an empty form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    // Check that the form wasn't submitted
    expect(register).not.toHaveBeenCalled();
    
    // The browser's built-in validation should prevent submission, but we can't test that directly
    // We can test that the register function wasn't called, which is our proxy for form validation working
  });
  
  test('shows loading state during form submission', async () => {
    // Make register function take some time to resolve
    register.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ user: {}, token: 'token' }), 100);
    }));
    
    renderWithAuthContext(<Register />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    // Check that the CircularProgress is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for the register function to resolve
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});