import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  CardActionArea, 
  IconButton, 
  useTheme,
  Chip,
  Tooltip,
  Avatar
} from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext'; 
import { FavoritesContext } from '../context/FavoritesContext';  

const CountryCard = ({ country }) => {   
  const navigate = useNavigate();   
  const theme = useTheme();   
  const { user } = useContext(AuthContext);   
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);      
  const isCountryFavorite = user && isFavorite(country.cca3);      
  
  const handleClick = () => {     
    navigate(`/country/${country.cca3}`);   
  };      
  
  const handleFavoriteClick = (e) => {     
    e.stopPropagation(); // Prevent card click when clicking favorite button          
    if (isCountryFavorite) {       
      removeFavorite(country.cca3);     
    } else {       
      addFavorite(country);     
    }   
  };

  // Format population with commas
  const formattedPopulation = new Intl.NumberFormat().format(country.population);
  
  // Get the continent emoji
  const getContinentEmoji = (region) => {
    const emojiMap = {
      'Africa': '🌍',
      'Americas': '🌎',
      'North America': '🌎',
      'South America': '🌎',
      'Asia': '🌏',
      'Europe': '🌍',
      'Oceania': '🌏',
      'Antarctica': '🗻',
    };
    return emojiMap[region] || '🌐';
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '12px',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 24px rgba(0,0,0,0.25)' 
          : '0 8px 24px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 14px 28px rgba(0,0,0,0.4)' 
            : '0 14px 28px rgba(0,0,0,0.2)',
        }
      }}
    >
      <CardActionArea 
        onClick={handleClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
          '&:hover .country-flag': {
            transform: 'scale(1.05)'
          }
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            paddingTop: '60%',
            overflow: 'hidden'
          }}
        >
          <CardMedia
            component="img"
            image={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            className="country-flag"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease-in-out',
            }}
          />
        </Box>
                
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 2.5, 
            position: 'relative',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(25,25,30,0.9)' 
              : 'rgba(255,255,255,1)',
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: '1.3rem',
              mb: 1
            }}
          >
            {country.name.common}
          </Typography>
          
          {/* Region indicator with emoji */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 2,
          }}>
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.1)' 
                : theme.palette.primary.light + '30',
              fontSize: '1.1rem',
            }}>
              {getContinentEmoji(country.region)}
            </Avatar>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.primary.light 
                  : theme.palette.primary.dark,
              }}
            >
              {country.region} {country.subregion && `· ${country.subregion}`}
            </Typography>
          </Box>
          
          {country.name.official !== country.name.common && (
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: 'text.secondary',
                mb: 1.5,
                fontStyle: 'italic',
                opacity: 0.8
              }}
            >
              {country.name.official}
            </Typography>
          )}
                    
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
            mt: 1.5,
            mb: 2.5
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}>
              <span role="img" aria-label="population" style={{ fontSize: '1.1rem' }}>👥</span>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                <Box component="span" sx={{ opacity: 0.7, mr: 0.5 }}>Population:</Box>
                {formattedPopulation}
              </Typography>
            </Box>
                        
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}>
              <span role="img" aria-label="capital" style={{ fontSize: '1.1rem' }}>🏙️</span>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                <Box component="span" sx={{ opacity: 0.7, mr: 0.5 }}>Capital:</Box>
                {country.capital?.[0] || 'N/A'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
          }}>
            <Chip 
              label="View Details" 
              color="primary"
              sx={{
                fontWeight: 600,
                px: 2,
                py: 2,
                fontSize: '0.85rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white'
                },
                transition: 'all 0.3s ease'
              }}
            />
          </Box>
          
          {/* Favorite button in bottom right */}
          {user && (
            <Tooltip title={isCountryFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton
                onClick={handleFavoriteClick}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(25,25,30,0.8)'
                    : 'rgba(255,255,255,0.95)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: '2px solid',
                  borderColor: theme.palette.info.light,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: isCountryFavorite ? 'scale(1.1)' : 'scale(1.1)',
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(25,25,30,0.9)'
                      : 'rgba(255,255,255,1)',
                  }
                }}
              >
                {isCountryFavorite ? (
                  <span style={{ fontSize: '1.4rem' }}>❤️</span>
                ) : (
                  <span style={{ fontSize: '1.4rem' }}>🤍</span>
                )}
              </IconButton>
            </Tooltip>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CountryCard;