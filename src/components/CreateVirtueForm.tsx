import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { Virtue } from '../types';

interface CreateVirtueFormProps {
  onVirtueCreated: (virtue: Virtue) => void;
}

const CreateVirtueForm = ({ onVirtueCreated }: CreateVirtueFormProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8787/api/virtues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          userId: 'user1', // Hardcoded for now, will be replaced with actual user ID
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create virtue');
      }

      // Fetch the newly created virtue to get full details
      const virtueResponse = await fetch('http://localhost:8787/api/virtues');
      const virtuesData = await virtueResponse.json();
      if (virtuesData.success && virtuesData.data.length > 0) {
        onVirtueCreated(virtuesData.data[0]);
      }

      setContent('');
    } catch (error) {
      console.error('Error creating virtue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
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