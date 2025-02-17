import { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { VirtueList, CreateVirtueForm } from '../components';
import { Virtue } from '../types';
import { config } from '../config';

const HomePage = () => {
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchVirtues = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/virtues`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch virtues');
      }
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    }
  }, []);

  const loadInitialVirtues = useCallback(async () => {
    setLoading(true);
    const initialVirtues = await fetchVirtues();
    setVirtues(initialVirtues);
    setLoading(false);
  }, [fetchVirtues]);

  const loadMoreVirtues = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const newVirtues = await fetchVirtues();
    setVirtues(prev => [...prev, ...newVirtues]);
    setIsLoadingMore(false);
  }, [isLoadingMore, fetchVirtues]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.offsetHeight
      ) {
        loadMoreVirtues();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreVirtues]);

  // Initial load
  useEffect(() => {
    loadInitialVirtues();
  }, [loadInitialVirtues]);

  const handleVirtueCreated = () => {
    loadInitialVirtues();    
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        p={2}
      >
        <Typography 
          color="error" 
          variant="h6" 
          textAlign="center"
          sx={{ maxWidth: 400 }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 600, mx: 'auto', position: 'relative' }}>
        <CreateVirtueForm onVirtueCreated={handleVirtueCreated} />
        <VirtueList virtues={virtues} />
        {isLoadingMore && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={30} thickness={4} />
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default HomePage;