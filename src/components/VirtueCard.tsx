import { 
  Card, 
  CardContent,
  Stack,
  Avatar, 
  Typography,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Virtue } from '../types';

interface VirtueCardProps {
  virtue: Virtue;
}

const VirtueCard = ({ virtue }: VirtueCardProps) => {
    console.log(virtue);

  const formattedDate = new Date(virtue.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const displayName = virtue.display_name;
  const username = virtue.username;
  const initial = displayName[0]?.toUpperCase();

  return (
    <Card       
      sx={{ 
        borderRadius: 2,
        width: '100%'
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                component={Link}
                to={`/profile/${username}`}
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  flexShrink: 0
                }}                
              >
                {initial}
              </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="baseline"
                sx={{ mb: 0.5 }}
              >                
                <>
                <Link 
                    to={`/profile/${username}`}
                    style={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      maxWidth: '100%'
                    }}
                >
                    <Typography 
                      variant="subtitle1"
                      component="span"
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.main'
                        },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}      
                    >
                      {displayName}
                    </Typography>
                </Link>
                <Typography 
                    variant="caption"                    
                    sx={{ 
                      color: 'text.secondary',
                      flexShrink: 0
                    }}
                >
                    • {formattedDate}
                </Typography>
                </>                
              </Stack>

              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'text.primary',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                {virtue.content}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VirtueCard;