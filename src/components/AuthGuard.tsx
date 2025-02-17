import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import LoginIcon from "@mui/icons-material/Login";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Please log in to access this feature
        </Typography>
        <Button
          variant="contained"
          onClick={login}
          startIcon={<LoginIcon />}
        >
          Log In
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};