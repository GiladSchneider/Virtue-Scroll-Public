import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Skeleton,
  Divider,
  useTheme,
  Alert,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Campaign as CampaignIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import { VirtueList } from "../components";
import { Virtue, User } from "../types";
import { config } from "../config";

const ProfilePage = () => {
  window.scrollTo({ top: 0, left: 0 });
  const theme = useTheme();
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    user: User | null;
    virtues: Virtue[];
  }>({ user: null, virtues: [] });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/api/users/${username}/virtues`
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch profile data");
        }

        if (data.data.length > 0) {
          const userData = {
            id: data.data[0].user_id,
            username: data.data[0].username,
            display_name: data.data[0].display_name,
            avatar_url: data.data[0].avatar_url,
            created_at: data.data[0].created_at,
            email: data.data[0].email,
          };
          setProfileData({
            user: userData,
            virtues: data.data,
          });
        } else {
          // Handle case where user exists but has no virtues
          const userResponse = await fetch(
            `${config.API_URL}/api/users/${username}`
          );
          const userData = await userResponse.json();

          if (userData.success && userData.data) {
            setProfileData({
              user: userData.data,
              virtues: [],
            });
          } else {
            setProfileData({ user: null, virtues: [] });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (!username) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const { user, virtues } = profileData;

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          User not found
        </Alert>
      </Container>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
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
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "2rem",
                }}
              >
                {user.display_name?.[0]}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {user.display_name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  @{user.username}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.display_name}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {virtues.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Virtues
            </Typography>
            <VirtueList virtues={virtues} />
          </>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            {user.display_name} hasn't shared any virtues yet
          </Alert>
        )}
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
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", gap: 3 }}>
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
          <Skeleton variant="text" width="70%" />
        </CardContent>
      </Card>

      <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Stack>
    </Box>
  </Container>
);

export default ProfilePage;
