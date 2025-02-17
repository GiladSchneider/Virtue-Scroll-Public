import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Campaign as CampaignIcon,
  Close as CloseIcon,
  AccountBalance,
} from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { config } from "../config";
import { getIdFromSub } from "../helpers";

interface CreateVirtueFormProps {
  onVirtueCreated: () => void;
  onClose?: () => void;
}

const MAX_LENGTH = 300;

const CreateVirtueForm: React.FC<CreateVirtueFormProps> = ({
  onVirtueCreated,
  onClose,
}) => {
  const theme = useTheme();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/me");
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${config.API_URL}/api/virtues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          content: trimmedContent,
          userId: getIdFromSub(user?.sub),
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create virtue");
      }

      setContent("");
      console.log(data);
      onVirtueCreated();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create virtue");
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = MAX_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <AccountBalance
            sx={{
              color: theme.palette.primary.main,
              mr: 2,
              fontSize: 40,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Share a Thought
          </Typography>
          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            error={isOverLimit || !!error}
            helperText={error}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              },
            }}
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color={isOverLimit ? "error" : "text.secondary"}
            >
              {300 - remainingChars}/300
            </Typography>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!content.trim() || loading || isOverLimit}
              endIcon={
                loading ? <CircularProgress size={20} /> : <CampaignIcon />
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              {!isAuthenticated
                ? "Login to Share"
                : loading
                ? "Reflecting..."
                : "Share Thought"}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateVirtueForm;
