import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import { Home, Person, Create, GitHub } from "@mui/icons-material";
import ThreePIcon from "@mui/icons-material/ThreeP";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useAuth0 } from "@auth0/auth0-react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const Layout = () => {
  const theme = useTheme();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();

  // Function to check if a route is active
  const isActiveRoute = (path: string) => location.pathname === path;

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
          borderColor: "grey.200",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1, sm: 2 },
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Box>
            <Tooltip title="Made by Gilad Schneider">
              <IconButton
                component="a"
                href="https://www.giladschneider.com"
                target="_blank"
              >
                <AutoFixHighIcon />
              </IconButton>
            </Tooltip>

            {/* GitHub Link */}
            <Tooltip title="View on GitHub">
              <IconButton
                component="a"
                href="https://github.com/yourusername/virtue-scroll"
                target="_blank"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="h6"
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

          {/* Logout Button */}
          {isAuthenticated && (
            <Button
              onClick={() => logout()}
              variant="contained"
              color="primary"
              endIcon={<LogoutIcon />}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          )}
          {/* Login Button */}
          {!isAuthenticated && (
            <Button
              onClick={() => loginWithRedirect()}
              variant="contained"
              color="primary"
              endIcon={<LoginIcon />}
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Toolbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 3,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Outlet />
      </Container>

      {/* Bottom Navigation Bar */}
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 5,
          left: 50,
          right: 50,
          zIndex: theme.zIndex.appBar,
          borderRadius: "12px",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "grey.200",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            py: 1,
            px: 2,
            maxWidth: "sm",
            mx: "auto",
          }}
        >
          <Tooltip title="Home">
            <IconButton
              component={Link}
              to="/"
              color={isActiveRoute("/") ? "primary" : "default"}
              sx={{
                transform: isActiveRoute("/") ? "scale(1.5)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <Home />
            </IconButton>
          </Tooltip>

          <Tooltip title="New Virtue">
            <IconButton
              color="primary"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                transform: "scale(1.5)",
              }}
              onClick={() => console.log("Create new virtue")}
            >
              <Create />
            </IconButton>
          </Tooltip>

          <Tooltip title={"Profile"}>
            <Link
              to={"/me"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton
                color={isActiveRoute("/me") ? "primary" : "default"}
                sx={{
                  transform: isActiveRoute("/me") ? "scale(1.5)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <Person />
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
      </Paper>

      {/* Bottom spacing to account for fixed navigation */}
      <Toolbar sx={{ minHeight: { xs: "64px", sm: "64px" } }} />
    </Box>
  );
};

export default Layout;
