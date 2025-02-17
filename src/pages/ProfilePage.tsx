import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Fade,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { VirtueList } from "../components";
import { Virtue, User } from "../types";
import { config } from "../config";
import CampaignIcon from "@mui/icons-material/Campaign";

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { username } = useParams<{ username: string }>();
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
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
          setUser(userData);
        }

        setVirtues(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          p: 3,
        }}
      >
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          User not found
        </Typography>
      </Box>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Fade in timeout={500}>
      <Container maxWidth="md" sx={{ pt: 3, pb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-start",
              gap: 3,
            }}
          >
            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                bgcolor: "primary.main",
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              {user.display_name?.[0] || user.username[0]}
            </Avatar>

            <Box
              sx={{
                flex: 1,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                }}
              >
                {user.display_name}
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                @{user.username}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Chip
                  icon={<CalendarMonth sx={{ fontSize: 16 }} />}
                  label={`Joined ${joinDate}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 1,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
                <Chip
                  icon={<CampaignIcon sx={{ fontSize: 16 }} />}
                  label={`${virtues.length} ${
                    virtues.length === 1 ? "Virtue" : "Virtues"
                  }`}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{
                    borderRadius: 1,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 2, px: { xs: 1, sm: 2 } }}>
          <VirtueList virtues={virtues} />
        </Box>
      </Container>
    </Fade>
  );
};

export default ProfilePage;
