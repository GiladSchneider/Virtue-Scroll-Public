// VirtueList.tsx
import { Box } from '@mui/material';
import VirtueCard from './VirtueCard';
import { Virtue } from '../types';

interface VirtueListProps {
  virtues: Virtue[];
}

const VirtueList = ({ virtues }: VirtueListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {virtues.map((virtue) => (
        <VirtueCard key={virtue.id} virtue={virtue} />
      ))}
    </Box>
  );
};

export default VirtueList;