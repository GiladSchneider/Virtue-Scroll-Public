import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Container,
  Skeleton,
  Stack,
  Chip,
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { VirtueList } from '../components';
import { Virtue, User } from '../types';
import { config } from '../config';
import { getIdFromSub } from '../helpers';

const ProfileDashboard = () => {
  const { user: auth0User } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [virtues, setVirtues] = useState<Virtue[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth0User?.sub) return;

      try {
        setLoading(true);
        const userId = getIdFromSub(auth0User.sub);

        // Fetch user data
        const userResponse = await fetch(`${config.API_URL}/api/users/${userId}`);
        const userData = await userResponse.json();

        if (!userData.success) {
          throw new Error(userData.error || 'Failed to fetch user data');
        }

        setUserData(userData.data);

        // Fetch user's virtues
        const virtuesResponse = await fetch(
          `${config.API_URL}/api/users/${userData.data.username}/virtues`
        );
        const virtuesData = await virtuesResponse.json();

        if (!virtuesData.success) {
          throw new Error(virtuesData.error || 'Failed to fetch virtues');
        }

        setVirtues(virtuesData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth0User]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !userData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">
          {error || 'Failed to load profile data'}
        </Typography>
      </Box>
    );
  }

  const joinDate = new Date(userData.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {userData.display_name?.[0] || '?'}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {userData.display_name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  @{userData.username}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip
                    icon={<CalendarIcon />}
                    label={`Joined ${joinDate}`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<CampaignIcon />}
                    label={`${virtues.length} ${
                        virtues.length === 1 ? "Virtue" : "Virtues"
                      }`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {userData.display_name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Your Virtues
        </Typography>
        <VirtueList virtues={virtues} />
      </Box>
    </Container>
  );
};

const ProfileSkeleton = () => (
  <Container maxWidth="md">
    <Box sx={{ mt: 4, mb: 6 }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="30%" height={24} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="40%" height={32} />
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </Stack>
        </CardContent>
      </Card>

      <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    </Box>
  </Container>
);

export default ProfileDashboard;