import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LoginIcon from "@mui/icons-material/Login";
import ThreePIcon from "@mui/icons-material/ThreeP";

const LoginCard = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 400,
        mx: "auto",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              mx: "auto",
              mb: 2,
            }}
          >
            <ThreePIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" component="h1" gutterBottom fontWeight={700}>
            Welcome to Virtue Scroll
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the conversation and share your thoughts
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => handleLogin()}
            startIcon={<LoginIcon />}
            sx={{
              py: 1.5,
              textTransform: "none",
            }}
          >
            Continue with Email
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ mt: 3, display: "block" }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Ok fine, we don't have those yet.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
