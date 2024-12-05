'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Divider,
} from '@mui/material';

export default function ProfileSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="text" width={250} height={48} />
        </Box>

        <Card sx={{ borderRadius: 2, boxShadow: '0 8px 32px rgba(27, 67, 50, 0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Skeleton 
                variant="circular"
                width={80}
                height={80}
                sx={{ flexShrink: 0 }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width={160} height={24} />
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Skeleton variant="rounded" height={56} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Skeleton variant="rounded" width={120} height={42} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}