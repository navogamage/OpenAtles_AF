import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import { 
  Home as HomeIcon,
  Visibility,
  VisibilityOff,
  Edit as EditIcon
} from '@mui/icons-material';
import { getUserProfile, updateUserProfile } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setUpdateLoading(true);
    setMessage(null);
    setError('');

    try {
      const userData = await updateUserProfile({
        name,
        email,
        password: password ? password : undefined
      });
      
      login(userData);
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ 
        py: 8, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 600
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '20px',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              mb: 3,
              boxShadow: 3
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              mb: 1
            }}
          >
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account information
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ 
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <EditIcon fontSize="small" /> Account Details
                </Typography>
                
                {message && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                    {message}
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: '12px' }
                  }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  margin="normal"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: '12px' }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ 
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <EditIcon fontSize="small" /> Change Password
                </Typography>

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="New Password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Leave blank to keep current password"
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: '12px' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm New Password"
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: '12px' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 5,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={updateLoading}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: '200px',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {updateLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;