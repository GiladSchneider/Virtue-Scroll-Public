import { Card, CardContent, CardHeader, Avatar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Virtue } from '../types';

interface VirtueCardProps {
  virtue: Virtue;
}

const VirtueCard = ({ virtue }: VirtueCardProps) => {
  // Format the date properly
  const formattedDate = new Date(virtue.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            {virtue.user?.displayName?.[0] || '?'}
          </Avatar>
        }
        title={
          <Link 
            to={`/profile/${virtue.user?.username}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography variant="subtitle1" component="span" fontWeight="bold">
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
        subheader={formattedDate}
      />
      <CardContent>
        <Typography variant="body1">
          {virtue.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VirtueCard;