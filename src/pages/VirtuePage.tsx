import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Container,
  Divider,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarMonthIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { config } from "../config";
import { Virtue } from "../types";

const VirtuePage = () => {
  const { virtueId } = useParams<{ virtueId: string }>();
  const navigate = useNavigate();
  const [virtue, setVirtue] = useState<Virtue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVirtue = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/api/virtues/${virtueId}`,
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch virtue");
        }

        setVirtue(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (virtueId) {
      fetchVirtue();
    }
  }, [virtueId]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Check out this Virtue by ${virtue?.display_name}`,
        url: window.location.href
      });
    } catch (err) {
      // Handle share error or user cancellation
      console.log("Sharing failed:", err);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !virtue) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        p={3}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error || "Virtue not found"}
        </Typography>
        <Typography
          component={Link}
          to="/"
          color="primary"
          sx={{ textDecoration: "none", mt: 2 }}
        >
          Return to Home
        </Typography>
      </Box>
    );
  }

  const formattedDate = new Date(virtue.created_at).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ color: "text.secondary" }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">VirtueScroll.com</Typography>
          </Box>
        </Paper>

        {/* Main Content */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          <CardContent>
            {/* Author info */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Avatar
                component={Link}
                to={`/profile/${virtue.username}`}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "primary.main",
                  textDecoration: "none",
                }}
              >
                {virtue.display_name[0]}
              </Avatar>
              <Box>
                <Typography
                  component={Link}
                  to={`/profile/${virtue.username}`}
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {virtue.display_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{virtue.username}
                </Typography>
              </Box>
            </Box>

            {/* Virtue content */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {virtue.content}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonthIcon
                  sx={{ color: "text.secondary", fontSize: 20 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Box>

              <Tooltip title="Share">
                <IconButton onClick={handleShare} size="small">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>        
      </Box>
    </Container>
  );
};

export default VirtuePage;
