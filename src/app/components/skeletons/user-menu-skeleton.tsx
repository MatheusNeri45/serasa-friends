'use client';

import {
  Box,
  IconButton,
  Skeleton,
} from '@mui/material';

export default function UserMenuSkeleton() {
  return (
    <Box>
      <IconButton
        size="small"
        sx={{ 
          ml: 2,
          cursor: 'default',
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
        disableRipple
      >
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{
            bgcolor: 'rgba(45, 106, 79, 0.1)',
          }}
        />
      </IconButton>
    </Box>
  );
}