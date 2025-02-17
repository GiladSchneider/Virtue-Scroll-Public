import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Button,
  Tooltip,
  useTheme,
  Paper,
  Dialog,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Create as CreateIcon,
  GitHub as GitHubIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AutoFixHigh as AutoFixHighIcon,
} from "@mui/icons-material";
import ThreePIcon from "@mui/icons-material/ThreeP";
import { CreateVirtueForm } from "../components";
import { useState } from "react";

const Layout = () => {
  const theme = useTheme();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleVirtueCreated = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "grey.50",
      }}
    >
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          {/* Left section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Made By Gilad Schneider">
              <IconButton
                component="a"
                href="https://www.giladschneider.com"
                target="_blank"
                size="small"
              >
                <AutoFixHighIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View on GitHub">
              <IconButton
                component="a"
                href="https://github.com/giladschneider/virtue-scroller"
                target="_blank"
                size="small"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Center section - Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Virtue Scroll
            <ThreePIcon />
          </Typography>

          {/* Right section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? (
              <Button
                variant="outlined"
                onClick={() => logout()}
                startIcon={<LogoutIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => loginWithRedirect()}
                startIcon={<LoginIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "64px", // Height of AppBar
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Bottom Navigation */}
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "auto",
          maxWidth: 320,
          borderRadius: "50px",
          zIndex: theme.zIndex.appBar,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            px: 3,
            py: 1,
            gap: 3,
          }}
        >
          <Tooltip title="Home">
            <IconButton
              component={Link}
              to="/"
              color={isActiveRoute("/") ? "primary" : "default"}
              sx={{
                transition: "all 0.2s",
                transform: isActiveRoute("/") ? "scale(1.1)" : "none",
              }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="New Virtue">
            <IconButton
              onClick={() => setIsDialogOpen(true)}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                width: 48,
                height: 48,
                transition: "all 0.2s",
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton
              component={Link}
              to="/me"
              color={isActiveRoute("/me") ? "primary" : "default"}
              sx={{
                transition: "all 0.2s",
                transform: isActiveRoute("/me") ? "scale(1.1)" : "none",
              }}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* New Virtue Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { bgcolor: "transparent", boxShadow: "none" } },
        }}
      >
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <CreateVirtueForm onVirtueCreated={handleVirtueCreated} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Layout;
