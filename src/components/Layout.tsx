import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  IconButton,
  Fab
} from '@mui/material';
import { Home, Person, Edit } from '@mui/icons-material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'grey.200'
        }}
      >
        <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'text.primary',
              flexGrow: 1,
              fontWeight: 600
            }}
          >
            Virtue Scroll
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton component={Link} to="/" color="inherit">
              <Home />
            </IconButton>
            <IconButton component={Link} to="/profile/johndoe" color="inherit">
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 3,
          position: 'relative'
        }}
      >
        <Outlet />
        <Fab 
          color="primary" 
          sx={{ 
            position: 'fixed',
            bottom: 24,
            right: 24
          }}
        >
          <Edit />
        </Fab>
      </Container>
    </Box>
  );
};

export default Layout;