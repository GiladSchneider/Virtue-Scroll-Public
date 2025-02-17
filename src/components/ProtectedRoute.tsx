import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { isProfileComplete } from "../helpers";
import {
  Button,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface ProtectedRouteProps {
  children: ReactNode;
  requireComplete?: boolean;
}

const ProtectedRoute = ({ children, requireComplete }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [isComplete, setIsComplete] = useState(false);
  const [profileCompleteLoading, setProfileCompleteLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.sub) {
        setProfileCompleteLoading(false);
        return;
      }

      const isComplete = await isProfileComplete(user.sub);

      setIsComplete(isComplete);
      setProfileCompleteLoading(false);
    };

    checkProfile();
  }, [user]);

  if (isLoading || profileCompleteLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ height: "100%", display: "flex", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container
        maxWidth="sm"
        sx={{ height: "100%", display: "flex", alignItems: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 500,
              textAlign: "center",
              mb: 3,
            }}
          >
            Sign in to continue
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
            Please sign in to access your profile and share thoughts
          </Typography>

          <Stack spacing={2} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => loginWithRedirect()}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              Sign in
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (requireComplete && !isComplete) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
