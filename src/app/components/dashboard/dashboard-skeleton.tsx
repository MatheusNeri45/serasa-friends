'use client';

import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import { Grid2 } from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "primary.main", fontWeight: "bold" }}
          >
            Serasa Friends
          </Typography>
          <Skeleton variant="circular" width={40} height={40} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Skeleton variant="text" width={200} height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={300} height={24} />
          </Box>
          <Skeleton variant="rounded" width={140} height={48} />
        </Box>

        <Grid2 container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={item}>
              <Card
                sx={{
                  height: "100%",
                  background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                  boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1.5 }} />
                    <Skeleton variant="text" width={120} height={32} />
                  </Box>
                  <Skeleton variant="text" width={140} height={48} sx={{ mb: 2 }} />
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 0.5 }} />
                  </Box>
                  <Skeleton variant="text" width={160} height={24} sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {[1, 2, 3].map((avatar) => (
                        <Skeleton
                          key={avatar}
                          variant="circular"
                          width={32}
                          height={32}
                        />
                      ))}
                    </Box>
                    <Skeleton variant="text" width={80} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Box sx={{ mt: 4 }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Card
                  sx={{
                    height: "100%",
                    background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                    boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width={100} height={24} />
                    </Box>
                    <Skeleton variant="text" width={120} height={40} />
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
}