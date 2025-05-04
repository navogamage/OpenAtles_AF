import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PublicIcon from '@mui/icons-material/Public';
import { getCountryByCode } from '../api/countries';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';

const CountryDetail = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(countryCode);
        setCountry(data);
      } catch (error) {
        console.error('Error fetching country:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountry();
  }, [countryCode]);

  const handleFavoriteToggle = () => {
    if (isFavorite(country.cca3)) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh',
        gap: 3
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading country information...</Typography>
      </Box>
    );
  }

  if (!country) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.error.light, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }}
        >
          <PublicIcon sx={{ fontSize: 60, color: 'error.light', mb: 2 }} />
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>Country not found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We couldn't find any information for the requested country.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            size="large"
            sx={{ 
              mt: 2,
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: theme.shadows[4]
            }}
          >
            Return Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const isCountryFavorite = user && isFavorite(country.cca3);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box 
        sx={{ 
          backgroundImage: 'linear-gradient(120deg, rgba(240,240,250,0.5), rgba(255,255,255,0.8))', 
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mb: { xs: 4, md: 6 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button 
            onClick={() => navigate(-1)} 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 3, 
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              backgroundColor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.95)',
              }
            }}
          >
            Back to Countries
          </Button>

          {user && (
            <Tooltip title={isCountryFavorite ? "Remove from favorites" : "Add to favorites"}>
              <Button
                variant={isCountryFavorite ? "contained" : "outlined"}
                color={isCountryFavorite ? "secondary" : "primary"}
                onClick={handleFavoriteToggle}
                startIcon={isCountryFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                sx={{ 
                  fontWeight: 600, 
                  px: 3, 
                  py: 1.2,
                  borderRadius: 2,
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s',
                  backgroundColor: isCountryFavorite ? undefined : 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isCountryFavorite ? 4 : 2,
                    backgroundColor: isCountryFavorite ? undefined : 'rgba(255,255,255,0.95)',
                  }
                }}
              >
                {isCountryFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Card 
        elevation={5} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          mb: 6,
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,1))'
        }}
      >
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white',
            p: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.light, 0.1)})`,
              zIndex: 1
            }
          }}
        >
          <Box sx={{ zIndex: 2 }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.75rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                mb: 1
              }}
            >
              {country.name.common}
            </Typography>
            
            <Typography 
              variant="subtitle1"
              sx={{ 
                opacity: 0.85,
                fontWeight: 500
              }}
            >
              {country.region}{country.subregion ? ` • ${country.subregion}` : ''}
            </Typography>
          </Box>
          
          {country.flag && (
            <Typography 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                ml: 'auto',
                mr: { xs: 1, md: 3 },
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 2
              }}
            >
              {country.flag}
            </Typography>
          )}
        </Box>
        
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 3, md: 4 },
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxHeight: { xs: '240px', sm: '320px', md: '400px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)',
                    borderRadius: 2,
                    pointerEvents: 'none'
                  }
                }}
              >
                <img
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2.5
                  }}>
                    {Object.values(country.name.nativeName || {})[0]?.common && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          NATIVE NAME
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {Object.values(country.name.nativeName)[0].common}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        POPULATION
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatNumber(country.population)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        REGION
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {country.region}
                      </Typography>
                    </Box>
                    
                    {country.subregion && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          SUB REGION
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {country.subregion}
                        </Typography>
                      </Box>
                    )}
                    
                    {country.capital && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          CAPITAL
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {country.capital[0]}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2.5,
                    height: '100%'
                  }}>
                    {country.tld && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          TOP LEVEL DOMAIN
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {country.tld[0]}
                        </Typography>
                      </Box>
                    )}
                    
                    {country.currencies && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          CURRENCIES
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {Object.values(country.currencies).map(curr => curr.name).join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    {country.languages && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          LANGUAGES
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {Object.values(country.languages).join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {country.borders && country.borders.length > 0 && (
                <Box sx={{ mt: 5 }}>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: 'text.primary' 
                    }}
                  >
                    BORDER COUNTRIES:
                  </Typography>
                  
                                      <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }}
                    >
                      {country.borders.map((border) => (
                        <Chip
                          key={border}
                          label={border}
                          onClick={() => navigate(`/country/${border}`)}
                          color="primary"
                          sx={{ 
                            cursor: 'pointer',
                            fontWeight: 600,
                            px: 2,
                            py: 2.5,
                            height: 'auto',
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.85)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
                            color: 'white',
                            '&:hover': {
                              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                              transform: 'translateY(-3px) scale(1.05)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default CountryDetail;