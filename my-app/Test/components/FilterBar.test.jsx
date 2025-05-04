import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FilterBar from '../../src/components/FilterBar';

// Create a theme for testing
const theme = createTheme();

// Helper function to render with theme provider
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('FilterBar Component', () => {
  // Mock props for testing
  const mockProps = {
    searchQuery: '',
    selectedRegion: '',
    selectedLanguage: '',
    onSearchChange: jest.fn(),
    onRegionChange: jest.fn(),
    onLanguageChange: jest.fn(),
    availableLanguages: ['English', 'Spanish', 'French', 'Arabic']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with all filters', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    // Check that primary elements are rendered
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Region')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Language')).toBeInTheDocument();
  });

  test('search input works correctly', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'united' } });
    
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('united');
  });

  test('region filter works correctly', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    const regionSelect = screen.getByLabelText('Filter by Region');
    fireEvent.mouseDown(regionSelect);
    
    // Select from dropdown
    const europeanOption = screen.getByText('Europe');
    fireEvent.click(europeanOption);
    
    expect(mockProps.onRegionChange).toHaveBeenCalledWith('Europe');
  });

  test('language filter works correctly', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    const languageSelect = screen.getByLabelText('Filter by Language');
    fireEvent.mouseDown(languageSelect);
    
    // Select from dropdown
    const spanishOption = screen.getByText('Spanish');
    fireEvent.click(spanishOption);
    
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('Spanish');
  });

  test('does not show active filters section when no filters are applied', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument();
  });

  test('shows region filter chip when region is selected', () => {
    const propsWithRegion = {
      ...mockProps,
      selectedRegion: 'Europe'
    };
    
    renderWithTheme(<FilterBar {...propsWithRegion} />);
    
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByText('region: Europe')).toBeInTheDocument();
  });

  test('shows language filter chip when language is selected', () => {
    const propsWithLanguage = {
      ...mockProps,
      selectedLanguage: 'French'
    };
    
    renderWithTheme(<FilterBar {...propsWithLanguage} />);
    
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByText('language: French')).toBeInTheDocument();
  });

  test('shows both filter chips when both filters are applied', () => {
    const propsWithBothFilters = {
      ...mockProps,
      selectedRegion: 'Asia',
      selectedLanguage: 'Arabic'
    };
    
    renderWithTheme(<FilterBar {...propsWithBothFilters} />);
    
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByText('region: Asia')).toBeInTheDocument();
    expect(screen.getByText('language: Arabic')).toBeInTheDocument();
  });

  test('clear region filter works correctly', () => {
    const propsWithRegion = {
      ...mockProps,
      selectedRegion: 'Africa'
    };
    
    renderWithTheme(<FilterBar {...propsWithRegion} />);
    
    const clearButton = screen.getByText('region: Africa').parentNode.querySelector('svg');
    fireEvent.click(clearButton);
    
    expect(mockProps.onRegionChange).toHaveBeenCalledWith('');
  });

  test('clear language filter works correctly', () => {
    const propsWithLanguage = {
      ...mockProps,
      selectedLanguage: 'English'
    };
    
    renderWithTheme(<FilterBar {...propsWithLanguage} />);
    
    const clearButton = screen.getByText('language: English').parentNode.querySelector('svg');
    fireEvent.click(clearButton);
    
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('');
  });

  test('clear all filters button appears when multiple filters are applied', () => {
    const propsWithBothFilters = {
      ...mockProps,
      selectedRegion: 'Americas',
      selectedLanguage: 'Spanish'
    };
    
    renderWithTheme(<FilterBar {...propsWithBothFilters} />);
    
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  test('clear all filters button works correctly', () => {
    const propsWithBothFilters = {
      ...mockProps,
      selectedRegion: 'Americas',
      selectedLanguage: 'Spanish'
    };
    
    renderWithTheme(<FilterBar {...propsWithBothFilters} />);
    
    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);
    
    expect(mockProps.onRegionChange).toHaveBeenCalledWith('');
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('');
  });

  test('clear all button does not appear with only one filter', () => {
    const propsWithOneFilter = {
      ...mockProps,
      selectedRegion: 'Europe'
    };
    
    renderWithTheme(<FilterBar {...propsWithOneFilter} />);
    
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  test('displays all available language options', () => {
    renderWithTheme(<FilterBar {...mockProps} />);
    
    const languageSelect = screen.getByLabelText('Filter by Language');
    fireEvent.mouseDown(languageSelect);
    
    // Check that all provided languages are in the dropdown
    expect(screen.getByText('All Languages')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('Arabic')).toBeInTheDocument();
  });
});