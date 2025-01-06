'use client';

import { Box, Tabs, Tab, Paper } from '@mui/material';
import { Users, FolderKanban } from 'lucide-react';

export type SummaryViewType = 'groups' | 'people';

interface ViewToggleProps {
  view: SummaryViewType;
  onViewChange: (view: SummaryViewType) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const handleChange = (_: React.SyntheticEvent, newValue: SummaryViewType) => {
    onViewChange(newValue);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={view}
          onChange={handleChange}
          aria-label="summary view"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              px: 3,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              height: '100%',
              borderRadius: 1.5,
              backgroundColor: 'rgba(45, 106, 79, 0.08)',
              zIndex: 0,
            },
          }}
        >
          <Tab
            icon={
              <FolderKanban 
                size={18} 
                style={{ 
                  strokeWidth: view === 'groups' ? 2.5 : 2,
                  transition: 'stroke-width 0.2s'
                }} 
              />
            }
            iconPosition="start"
            label="Grupos"
            value="groups"
            sx={{ 
              zIndex: 1,
              gap: 1,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                transform: 'scale(1.02)',
              }
            }}
          />
          <Tab
            icon={
              <Users 
                size={18} 
                style={{ 
                  strokeWidth: view === 'people' ? 2.5 : 2,
                  transition: 'stroke-width 0.2s'
                }} 
              />
            }
            iconPosition="start"
            label="Amigos"
            value="people"
            sx={{ 
              zIndex: 1,
              gap: 1,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                transform: 'scale(1.02)',
              }
            }}
          />
        </Tabs>
      </Paper>
    </Box>
  );
}