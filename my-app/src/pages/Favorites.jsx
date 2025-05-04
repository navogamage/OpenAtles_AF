import { useState, useContext, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import CountryCard from '../components/CountryCard';

const Favorites = () => {
  const { favorites, loading } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user && !loading) {
      navigate('/login');
    } else {
      setMounted(true);
    }
  }, [user, loading, navigate]);

  if (!mounted || !user) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '60vh'
      }}>
        <CircularProgress 
          size={64} 
          thickness={4}
          sx={{ 
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 3, 
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.85) : alpha(theme.palette.common.black, 0.7)
          }}
        >
          Loading your favorites...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box 
        sx={{ 
          mb: { xs: 3, md: 5 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ 
              fontWeight: 800, 
              color: theme.palette.primary.main,
              mb: 1
            }}
          >
            My Favorite Countries
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : alpha(theme.palette.common.black, 0.6),
              fontWeight: 400
            }}
          >
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'country' : 'countries'}`
              : 'Start adding countries to your collection'}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ 
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.95rem',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 6px 16px rgba(0,0,0,0.4)' 
                : '0 6px 16px rgba(0,0,0,0.15)',
            }
          }}
        >
          Explore All Countries
        </Button>
      </Box>
      
      <Divider sx={{ 
        mb: { xs: 3, md: 4 },
        opacity: 0.7
      }} />

      {favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((country) => (
            <Grid item key={country.cca3} xs={12} sm={6} md={4} lg={3}>
              <CountryCard country={country} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={theme.palette.mode === 'dark' ? 4 : 2}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: '12px',
            mt: 4,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8) 
              : theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'dark' 
              ? alpha(theme.palette.divider, 0.1) 
              : alpha(theme.palette.divider, 0.15)}`,
          }}
        >
          <Box sx={{
            width: '100%',
            maxWidth: '500px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box 
              component="span" 
              sx={{ 
                fontSize: '4rem', 
                mb: 3, 
                opacity: 0.7,
                display: 'block'
              }}
            >
              🌎
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
              }}
            >
              You haven't added any favorites yet
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                maxWidth: '400px',
                mx: 'auto'
              }}
            >
              Explore countries and click the heart icon to add them to your favorites collection
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/')}
              sx={{ 
                fontWeight: 600, 
                px: 4,
                py: 1.2,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 12px rgba(0,0,0,0.3)' 
                  : '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 6px 16px rgba(0,0,0,0.4)' 
                    : '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              Start Exploring
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Favorites;