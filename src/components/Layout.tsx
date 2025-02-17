import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              flexGrow: 1 
            }}
          >
            Virtue Scroll
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              component={Link}
              to="/profile/johndoe"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              Profile
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;