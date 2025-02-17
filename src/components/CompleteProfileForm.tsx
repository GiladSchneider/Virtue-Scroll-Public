import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  CircularProgress,
  InputAdornment,
  Alert,  
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThreePIcon from '@mui/icons-material/ThreeP';
import { createOrUpdateUser } from '../helpers';

const CompleteProfileForm = () => {  
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    display_name: user?.name || '',
    email: user?.email || '',
  });

  const [validation, setValidation] = useState({
    username: true,
    display_name: true,
    email: true,
  });

  const validateUsername = (username: string) => {
    return /^[a-zA-Z0-9_]{3,15}$/.test(username);
  };

  const validateDisplayName = (name: string) => {
    return name.length >= 2 && name.length <= 50;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const isUsernameValid = validateUsername(formData.username);
    const isDisplayNameValid = validateDisplayName(formData.display_name);
    const isEmailValid = validateEmail(formData.email);

    setValidation({
      username: isUsernameValid,
      display_name: isDisplayNameValid,
      email: isEmailValid,
    });

    if (!isUsernameValid || !isDisplayNameValid || !isEmailValid) {
      return;
    }

    setLoading(true);

    try {
      const accessToken = await getAccessTokenSilently();
      await createOrUpdateUser(user, accessToken, formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/'); 
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    setValidation(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'primary.main',
            mb: 2,
          }}
        >
          <ThreePIcon sx={{ fontSize: 32 }} />
        </Avatar>

        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ fontWeight: 700 }}
        >
          Complete Your Profile
        </Typography>
        
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Just a few more details to get you started with Virtue Scroll
        </Typography>

        <Card
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {success && (
              <Alert 
                icon={<CheckCircleIcon fontSize="inherit" />} 
                severity="success"
                sx={{ mb: 3 }}
              >
                Profile updated successfully! Redirecting...
              </Alert>
            )}

            {error && (
              <Alert 
                icon={<ErrorOutlineIcon fontSize="inherit" />} 
                severity="error"
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                error={!validation.username}
                helperText={!validation.username ? 
                  "Username must be 3-15 characters and can only contain letters, numbers, and underscores" : 
                  "This will be your unique identifier"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">@</InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Display Name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                margin="normal"
                required
                error={!validation.display_name}
                helperText={!validation.display_name ? 
                  "Display name must be 2-50 characters" : 
                  "This is how your name will appear to others"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                error={!validation.email}
                helperText={!validation.email ? 
                  "Please enter a valid email address" : 
                  "Your email will not be shown publicly"}
                sx={{ mb: 4 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CompleteProfileForm;