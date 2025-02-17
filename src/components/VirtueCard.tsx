import { Card, Stack, Avatar, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import type { Virtue } from "../types";

interface VirtueCardProps {
  virtue: Virtue;
}

const VirtueCard = ({ virtue }: VirtueCardProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(virtue.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  const displayName = virtue.display_name;
  const username = virtue.username;
  const initial = displayName[0]?.toUpperCase();

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking user elements
  };

  const handleCardClick = () => {
    navigate(`/virtue/${virtue.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 2,
        width: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
        "&:active": {
          transform: "translateY(0px)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              component={Link}
              to={`/profile/${username}`}
              onClick={handleUserClick}
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontSize: "1.125rem",
                fontWeight: 500,
                textDecoration: "none",
                flexShrink: 0,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {initial}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Link
                  to={`/profile/${username}`}
                  onClick={handleUserClick}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {displayName}
                  </Typography>
                </Link>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "inline-flex",
                    alignItems: "center",
                    "&::before": {
                      content: '"•"',
                      mx: 0.5,
                    },
                  }}
                >
                  {formattedDate}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "text.primary",
                  overflow: "hidden",
                  wordWrap: "break-word",
                }}
              >
                {virtue.content}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default VirtueCard;
