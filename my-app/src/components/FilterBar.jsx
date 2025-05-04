import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Paper,
  Typography,
  Chip,
  Grid,
  Button,
  InputAdornment,
  useTheme
} from '@mui/material';
import { useState, useEffect } from 'react';

const FilterBar = ({ 
  searchQuery, 
  selectedRegion, 
  selectedLanguage,
  onSearchChange, 
  onRegionChange,
  onLanguageChange,
  availableLanguages = []
}) => {
  const theme = useTheme();
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const [activeFilters, setActiveFilters] = useState([]);

  // Update active filters whenever filters change
  useEffect(() => {
    const filters = [];
    if (selectedRegion) filters.push({ type: 'region', value: selectedRegion });
    if (selectedLanguage) filters.push({ type: 'language', value: selectedLanguage });
    setActiveFilters(filters);
  }, [selectedRegion, selectedLanguage]);

  // Clear individual filters
  const clearFilter = (filterType) => {
    if (filterType === 'region') {
      onRegionChange('');
    } else if (filterType === 'language') {
      onLanguageChange('');
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    onRegionChange('');
    onLanguageChange('');
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: '24px',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, rgba(42,45,60,0.9) 0%, rgba(30,30,32,0.9) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,247,250,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.06)',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.05)'
          : '1px solid rgba(255, 255, 255, 0.8)',
      }}
    >
      <Grid container spacing={3}>
        {/* Search field */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Search for a country..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ fontSize: '1.2rem' }}>🔍</span>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.2)' 
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }
            }}
          />
        </Grid>

        {/* Region filter */}
        <Grid item xs={12} sm={6} md={3.5}>
          <FormControl fullWidth>
            <InputLabel id="region-select-label">Filter by Region</InputLabel>
            <Select
              labelId="region-select-label"
              value={selectedRegion}
              label="Filter by Region"
              onChange={(e) => onRegionChange(e.target.value)}
              sx={{
                borderRadius: '16px',
                '& .MuiSelect-select': {
                  pl: 2
                },
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.2)' 
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px',
                    mt: 1,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  }
                }
              }}
            >
              <MenuItem value="">All Regions</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region} sx={{ py: 1.2 }}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Language filter */}
        <Grid item xs={12} sm={6} md={3.5}>
          <FormControl fullWidth>
            <InputLabel id="language-select-label">Filter by Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={selectedLanguage}
              label="Filter by Language"
              onChange={(e) => onLanguageChange(e.target.value)}
              sx={{
                borderRadius: '16px',
                '& .MuiSelect-select': {
                  pl: 2
                },
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.2)' 
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '12px',
                    mt: 1,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    maxHeight: 320
                  }
                }
              }}
            >
              <MenuItem value="">All Languages</MenuItem>
              {availableLanguages.map((language) => (
                <MenuItem key={language} value={language} sx={{ py: 1.2 }}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: 1.5,
                mt: 1
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                Active Filters:
              </Typography>
              
              {activeFilters.map((filter) => (
                <Chip
                  key={`${filter.type}-${filter.value}`}
                  label={`${filter.type}: ${filter.value}`}
                  onDelete={() => clearFilter(filter.type)}
                  color="primary"
                  variant="outlined"
                  size="medium"
                  sx={{ 
                    fontWeight: 500, 
                    borderRadius: '12px',
                    px: 0.5,
                    borderWidth: '2px',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(121, 134, 203, 0.15)'
                        : 'rgba(57, 73, 171, 0.08)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
              
              {activeFilters.length > 1 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearAllFilters}
                  sx={{ 
                    ml: 1, 
                    fontWeight: 500, 
                    borderRadius: '12px',
                    borderWidth: '2px', 
                    px: 2,
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(121, 134, 203, 0.15)'
                        : 'rgba(57, 73, 171, 0.08)'
                    }
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default FilterBar;