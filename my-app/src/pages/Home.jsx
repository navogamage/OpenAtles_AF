import { Container, Grid, Box, CircularProgress, Typography, Paper } from '@mui/material';
import FilterBar from '../components/FilterBar';
import CountryCard from '../components/CountryCard';
import { useCountries } from '../hook/hook';

const Home = () => {
  const {
    countries,
    loading,
    error,
    searchQuery,
    region,
    language,
    availableLanguages,
    setSearchQuery,
    setRegion,
    setLanguage
  } = useCountries();

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '16px',
            bgcolor: 'error.light'
          }}
        >
          <Typography variant="h5" component="h1" color="error" gutterBottom>
            Error Loading Countries
          </Typography>
          <Typography>
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FilterBar
        searchQuery={searchQuery}
        selectedRegion={region}
        selectedLanguage={language}
        onSearchChange={setSearchQuery}
        onRegionChange={setRegion}
        onLanguageChange={setLanguage}
        availableLanguages={availableLanguages}
      />

      {loading ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '50vh'
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Loading countries...
          </Typography>
        </Box>
      ) : countries.length > 0 ? (
        <Grid container spacing={3}>
          {countries.map((country) => (
            <Grid item key={country.cca3} xs={12} sm={6} md={4} lg={3}>
              <CountryCard country={country} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{
          textAlign: 'center',
          py: 8
        }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            No countries found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;