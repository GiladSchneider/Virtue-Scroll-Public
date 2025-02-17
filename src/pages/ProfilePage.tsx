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
  const theme = useTheme();
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [virtues, setVirtues] = useState<Virtue[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;

      try {
        setLoading(true);

        // First, fetch the user data
        const userResponse = await fetch(
          `${config.API_URL}/api/users/${username}`,
        );
        const userData = await userResponse.json();

        if (!userData.success) {
          throw new Error(userData.error || "Failed to fetch user data");
        }

        setUser(userData.data);

        // Then fetch their virtues
        const virtuesResponse = await fetch(
          `${config.API_URL}/api/users/${username}/virtues`,
        );
        const virtuesData = await virtuesResponse.json();

        if (!virtuesData.success) {
          throw new Error(virtuesData.error || "Failed to fetch virtues");
        }

        setVirtues(virtuesData.data);
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

  // centered circular progress
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Container>
    );
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

export default ProfilePage;
