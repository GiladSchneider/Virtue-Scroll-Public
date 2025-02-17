import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Virtue } from '../types';
import { config } from '../config';

interface CreateVirtueFormProps {
  onVirtueCreated: (virtue: Virtue) => void;
}

const CreateVirtueForm = ({ onVirtueCreated }: CreateVirtueFormProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_URL}/api/virtues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          userId: 'user1',
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create virtue');
      }

      const virtueResponse = await fetch(`${config.API_URL}/api/virtues`);
      const virtuesData = await virtueResponse.json();
      if (virtuesData.success && virtuesData.data.length > 0) {
        onVirtueCreated(virtuesData.data[0]);
      }

      setContent('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create virtue');
      console.error('Error creating virtue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!content.trim() || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Post Virtue'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateVirtueForm;