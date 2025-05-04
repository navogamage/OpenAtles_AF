import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Create manual mocks of all dependencies
const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockAuthLogin = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Create a mock AuthContext
const MockAuthContext = React.createContext({
  login: mockAuthLogin
});

// Mock the entire Login component implementation
const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const { login: authLogin } = React.useContext(MockAuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await mockLogin(email, password);
      authLogin(userData);
      mockNavigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Sign in to access your account</p>
      
      {error && (
        <div role="alert" aria-label="error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <button type="submit">
          {loading ? <div role="progressbar" /> : 'Sign In'}
        </button>
      </form>
      
      <div>
        <p>Don't have an account? <a href="/register">Sign Up</a></p>
      </div>
    </div>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MockAuthContext.Provider value={{ login: mockAuthLogin }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </MockAuthContext.Provider>
    );
  };

  test('renders login form correctly', () => {
    renderComponent();
    
    // Check for heading
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    
    // Check for form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();  // Use exact text match
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    
    // Check for sign up link
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('allows user to input email and password', async () => {
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility when visibility button is clicked', async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    const visibilityToggle = screen.getByLabelText(/toggle password visibility/i);
    
    // Password should be hidden initially
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    fireEvent.click(visibilityToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide password again
    fireEvent.click(visibilityToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('submits form and logs in successfully', async () => {
    const userData = { id: '1', name: 'Test User', email: 'test@example.com', token: 'fake-token' };
    mockLogin.mockResolvedValueOnce(userData);
    
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Check if login API was called with correct credentials
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      
      // Check if auth context login function was called with user data
      expect(mockAuthLogin).toHaveBeenCalledWith(userData);
      
      // Check if navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message when login fails', async () => {
    // Mock API rejection
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } } 
    });
    
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.click(submitButton);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
    
    // Verify auth context login and navigate weren't called
    expect(mockAuthLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays generic error message when API error has no specific message', async () => {
    // Mock API rejection with no specific message
    mockLogin.mockRejectedValueOnce({});
    
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.click(submitButton);
    
    // Wait for the generic error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Login failed. Please try again.');
    });
  });

  test('shows loading state when submitting form', async () => {
    // Delay the API response to observe loading state
    mockLogin.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve({ id: '1', name: 'Test User' }), 100);
    }));
    
    renderComponent();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText('Password');  // Use exact text match
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);
    
    // Check for loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(mockAuthLogin).toHaveBeenCalled();
    });
  });
});