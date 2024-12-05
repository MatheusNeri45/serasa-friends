'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Skeleton,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Grid2 } from "@mui/material";

export default function GroupPageSkeleton() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 4 }}>
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
      <Toolbar />
      <Container maxWidth="xl">
        <Box sx={{ pt: 3, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <IconButton
                sx={{
                  mb: 2,
                  color: "primary.main",
                  alignSelf: "center",
                  mr: "4px",
                }}
                disabled
              >
                <Skeleton variant="circular" width={24} height={24} />
              </IconButton>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[1, 2, 3, 4].map((index) => (
                    <Skeleton
                      key={index}
                      variant="circular"
                      width={32}
                      height={32}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rounded" width={150} height={48} />
              <Skeleton variant="rounded" width={150} height={48} />
            </Box>
          </Box>

          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 0.5,
                  background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                  boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Skeleton
                    variant="text"
                    width={200}
                    height={32}
                    sx={{ mx: "auto", mb: 3 }}
                  />
                  {[1, 2, 3].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 3,
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Skeleton variant="text" width={160} height={24} />
                            <Skeleton variant="text" width={120} height={20} />
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Skeleton variant="text" width={80} height={28} />
                            <Skeleton variant="text" width={60} height={20} />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Skeleton variant="rounded" width={100} height={24} />
                          <Skeleton variant="rounded" width={100} height={24} />
                          <Skeleton variant="rounded" width={100} height={24} />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 0.5,
                  background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                  boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Skeleton
                    variant="text"
                    width={140}
                    height={32}
                    sx={{ mx: "auto", mb: 3 }}
                  />
                  {[1, 2, 3].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Skeleton variant="circular" width={44} height={44} />
                      <Box sx={{ width: 140 }}>
                        <Skeleton variant="text" width={120} height={24} />
                      </Box>
                      <Skeleton
                        variant="rounded"
                        width={120}
                        height={40}
                        sx={{ ml: "auto" }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
}