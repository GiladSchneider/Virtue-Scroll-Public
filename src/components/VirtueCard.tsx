import { Card, CardContent, CardHeader, Avatar, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder, Share } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Virtue } from '../types';

interface VirtueCardProps {
  virtue: Virtue;
}

const VirtueCard = ({ virtue }: VirtueCardProps) => {
  const [isLiked, setIsLiked] = useState(virtue.isLiked || false);
  const [likeCount, setLikeCount] = useState(virtue.likeCount || 0);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar alt={virtue.user?.displayName}>
            {virtue.user?.displayName?.[0] || '?'}
          </Avatar>
        }
        title={
          <Link 
            to={`/profile/${virtue.user?.username}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography variant="subtitle1" component="span">
              {virtue.user?.displayName}
            </Typography>
            <Typography 
              variant="subtitle2" 
              component="span" 
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              @{virtue.user?.username}
            </Typography>
          </Link>
        }
        subheader={new Date(virtue.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />
      <CardContent>
        <Typography variant="body1">{virtue.content}</Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLikeClick} color={isLiked ? 'primary' : 'default'}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likeCount}
          </Typography>
          <IconButton sx={{ ml: 1 }}>
            <Share />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VirtueCard;