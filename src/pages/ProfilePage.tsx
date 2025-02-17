import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { CalendarMonth, LocationOn } from '@mui/icons-material';
import VirtueList from '../components/VirtueList';
import { Virtue, User } from '../types';
import { config } from '../config';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_URL}/api/users/${username}/virtues`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch profile data');
        }
        
        if (data.data.length > 0) {
          // Get user data from the first virtue
          const userData = {
            id: data.data[0].user_id,
            username: data.data[0].username,
            displayName: data.data[0].display_name,
            avatarUrl: data.data[0].avatar_url,
            createdAt: data.data[0].created_at,
          };
          setUser(userData);
        }
        
        setVirtues(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

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

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Profile Header */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item>
            <Avatar 
              sx={{ width: 120, height: 120 }}
              alt={user.displayName}
            >
              {user.displayName[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user.displayName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth color="action" />
                <Typography variant="body2" color="text.secondary">
                  Joined {joinDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body2" color="text.secondary">
                  Earth
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Section */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6">{virtues.length}</Typography>
            <Typography color="text.secondary">Virtues</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">0</Typography>
            <Typography color="text.secondary">Following</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">0</Typography>
            <Typography color="text.secondary">Followers</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Virtues List */}
      <Typography variant="h6" gutterBottom>
        Virtues
      </Typography>
      <VirtueList virtues={virtues} />
    </Box>
  );
};

export default ProfilePage;