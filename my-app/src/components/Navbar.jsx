import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  IconButton, 
  useTheme, 
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Badge,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
  Fade
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const colorMode = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
    setMobileMenuOpen(false);
  };

  const handleFavoritesClick = () => {
    handleClose();
    navigate('/favorites');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
    >
      <List sx={{ pt: 2 }}>
        {user && (
          <>
            <ListItem>
              <Box sx={{ p: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography fontWeight={600} variant="subtitle1">{user.name}</Typography>
              </Box>
            </ListItem>
            <Divider sx={{ my: 1.5 }} />
            <ListItem button onClick={handleProfileClick} sx={{ py: 1.5 }}>
              <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
            <ListItem button onClick={handleFavoritesClick} sx={{ py: 1.5 }}>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>❤️</span>
                    <Badge 
                      badgeContent={favorites.length} 
                      color="primary"
                      sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}
                    >
                      My Favorites
                    </Badge>
                  </Box>
                } 
              />
            </ListItem>
            <Divider sx={{ my: 1.5 }} />
            <ListItem button onClick={handleLogout} sx={{ color: 'text.secondary', py: 1.5 }}>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
          </>
        )}
        {!user && (
          <>
            <ListItem button component={Link} to="/login" onClick={() => setMobileMenuOpen(false)} sx={{ py: 1.5 }}>
              <ListItemText primary="Sign In" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={() => setMobileMenuOpen(false)} sx={{ py: 1.5 }}>
              <ListItemText primary="Sign Up" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
          </>
        )}
        <Divider sx={{ my: 1.5 }} />
        <ListItem button onClick={colorMode.toggleColorMode} sx={{ py: 1.5 }}>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {theme.palette.mode === 'dark' ? (
                  <>
                    <span style={{ fontSize: '1.2rem', marginRight: '12px' }}>☀️</span>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.2rem', marginRight: '12px' }}>🌙</span>
                    <span>Dark Mode</span>
                  </>
                )}
              </Box>
            } 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 30, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            py: 1.8
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '0.5px',
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                textShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(120, 120, 255, 0.2)' : 'none'
              }}
            >
              {isMobile ? 'World Explorer' : 'OpenAtlas'}
            </Typography>
          </Box>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user && (
                <Button
                  component={Link}
                  to="/favorites"
                  color="primary"
                  sx={{
                    minWidth: 0,
                    p: 1,
                    mr: 1,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Badge 
                    badgeContent={favorites.length} 
                    color="primary"
                    max={99}
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontWeight: 600,
                        bgcolor: theme.palette.mode === 'dark' ? '#6d7bff' : '#3949ab'
                      } 
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>❤️</span>
                  </Badge>
                </Button>
              )}
              
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleMobileMenu}
                sx={{ 
                  ml: 1,
                  bgcolor: 'background.default',
                  width: 40,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>☰</span>
              </IconButton>
              
              <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                PaperProps={{
                  sx: {
                    width: 280,
                    borderRadius: '12px 0 0 12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {mobileMenuContent}
              </Drawer>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {user && (
                <Button
                  component={Link}
                  to="/favorites"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>❤️</span>
                  <Badge 
                    badgeContent={favorites.length} 
                    color="primary"
                    max={99}
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontWeight: 600,
                        bgcolor: theme.palette.mode === 'dark' ? '#6d7bff' : '#3949ab'
                      } 
                    }}
                  >
                    Favorites
                  </Badge>
                </Button>
              )}
              
              {user ? (
                <>
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ 
                      ml: 2,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: theme.palette.mode === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 250 }}
                    PaperProps={{
                      elevation: 5,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 6px 20px rgba(0,0,0,0.25))',
                        mt: 1.5,
                        minWidth: 250,
                        borderRadius: '16px',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 20,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ 
                      p: 2, 
                      pb: 1.5, 
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(to right, #1a1a2e, #16213e)' 
                        : 'linear-gradient(to right, #e8f0fe, #d4e4fa)',
                      borderRadius: '16px 16px 0 0'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main',
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            mr: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            border: theme.palette.mode === 'dark' ? '2px solid rgba(255,255,255,0.15)' : '2px solid white'
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={700} variant="body1">{user.name}</Typography>
                          {user.email && (
                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                              {user.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ px: 0.5, py: 1 }}>
                      <MenuItem 
                        onClick={handleProfileClick} 
                        sx={{ 
                          borderRadius: '8px', 
                          m: 0.5, 
                          p: 1.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '36px', '& > *': { fontSize: '1.2rem' } }}>
                          <span role="img" aria-label="profile">👤</span>
                        </ListItemIcon>
                        <Typography fontWeight={500}>My Profile</Typography>
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={handleFavoritesClick} 
                        sx={{ 
                          borderRadius: '8px', 
                          m: 0.5, 
                          p: 1.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '36px', '& > *': { fontSize: '1.2rem' } }}>
                          <span role="img" aria-label="favorites">❤️</span>
                        </ListItemIcon>
                        <Typography fontWeight={500}>
                          <Badge 
                            badgeContent={favorites.length} 
                            color="primary"
                            max={99}
                            sx={{ 
                              '& .MuiBadge-badge': { 
                                fontWeight: 600,
                                bgcolor: theme.palette.mode === 'dark' ? '#6d7bff' : '#3949ab'
                              } 
                            }}
                          >
                            My Favorites
                          </Badge>
                        </Typography>
                      </MenuItem>
                    </Box>
                    
                    <Divider sx={{ my: 0.5, opacity: 0.6 }} />
                    
                    <Box sx={{ px: 0.5, py: 1 }}>
                      <MenuItem 
                        onClick={colorMode.toggleColorMode} 
                        sx={{ 
                          borderRadius: '8px', 
                          m: 0.5, 
                          p: 1.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '36px', '& > *': { fontSize: '1.2rem' } }}>
                          {theme.palette.mode === 'dark' ? (
                            <span role="img" aria-label="light mode">☀️</span>
                          ) : (
                            <span role="img" aria-label="dark mode">🌙</span>
                          )}
                        </ListItemIcon>
                        <Typography fontWeight={500}>
                          {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Typography>
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={handleLogout} 
                        sx={{ 
                          borderRadius: '8px', 
                          m: 0.5, 
                          p: 1.5,
                          color: theme.palette.mode === 'dark' ? '#ff6b6b' : '#d32f2f',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,107,107,0.1)' : 'rgba(211,47,47,0.04)',
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: '36px', 
                          '& > *': { 
                            fontSize: '1.2rem',
                            color: theme.palette.mode === 'dark' ? '#ff6b6b' : '#d32f2f'
                          } 
                        }}>
                          <span role="img" aria-label="logout">🚪</span>
                        </ListItemIcon>
                        <Typography fontWeight={500}>Logout</Typography>
                      </MenuItem>
                    </Box>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderWidth: 2,
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
                aria-label="toggle theme"
                sx={{
                  ml: 1,
                  bgcolor: 'background.default',
                  width: 40,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '2px solid #82b1ff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'rotate(20deg)',
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.06)',
                    borderColor: '#2979ff',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? (
                  <span style={{ fontSize: '1.2rem' }}>☀️</span>
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>🌙</span>
                )}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;