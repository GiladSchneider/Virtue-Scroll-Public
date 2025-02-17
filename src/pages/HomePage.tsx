import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { VirtueList, CreateVirtueForm } from '../components';
import { Virtue } from '../types';
import { config } from '../config';

const HomePage = () => {
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVirtues = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/virtues`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch virtues');
        }
        
        setVirtues(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVirtues();
  }, []);

  const handleVirtueCreated = (newVirtue: Virtue) => {
    setVirtues(prev => [newVirtue, ...prev]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <CreateVirtueForm onVirtueCreated={handleVirtueCreated} />
      <VirtueList virtues={virtues} />
    </Box>
  );
};

export default HomePage;