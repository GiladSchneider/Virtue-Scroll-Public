// CreateVirtueForm.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useAuth0 } from "@auth0/auth0-react";
import { Virtue } from "../types";
import { config } from "../config";

interface CreateVirtueFormProps {
  onVirtueCreated: (virtue: Virtue) => void;
}

const CreateVirtueForm: React.FC<CreateVirtueFormProps> = ({
  onVirtueCreated,
}) => {
  const theme = useTheme();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Create virtue
      const createResponse = await fetch(`${config.API_URL}/api/virtues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: content.trim(),
          userId: user?.id,
        }),
      });

      const createData = await createResponse.json();
      if (!createData.success) {
        throw new Error(createData.error || "Failed to create virtue");
      }

      // Fetch updated virtues
      const virtuesResponse = await fetch(`${config.API_URL}/api/virtues`, {
        credentials: "include",
      });
      const virtuesData = await virtuesResponse.json();

      if (virtuesData.success && virtuesData.data.length > 0) {
        onVirtueCreated(virtuesData.data[0]);
      }

      // Reset form
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create virtue");
      console.error("Error creating virtue:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: theme.shadows[3],
        borderRadius: 2,
      }}
    >
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccountBalanceIcon
              sx={{
                color: theme.palette.primary.main,
                mr: 2,
                fontSize: 40,
              }}
            />
            <Typography variant="h6" color="textSecondary">
              Share A Thought
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            error={!!error}
            helperText={error}
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="textSecondary">
              {content.length}/300
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!content.trim() || loading}
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
                ? "Login/Sign Up to Share"
                : loading
                ? "Reflecting..."
                : "Share Thought"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateVirtueForm;
