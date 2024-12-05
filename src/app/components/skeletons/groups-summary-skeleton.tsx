'use client';

import {
  Box,
  Card,
  CardContent,
  List,
  Skeleton,
  Divider,
} from "@mui/material";

export default function SummarySkeleton() {
  return (
    <Card sx={{ mt: 4, mb: 4, borderRadius: 1 }}>
      <CardContent>
        <List>
          {[1, 2, 3].map((item) => (
            <Box key={item}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Skeleton 
                  variant="circular" 
                  width={48} 
                  height={48} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton 
                    variant="text" 
                    width={120} 
                    height={24} 
                    sx={{ mb: 1 }} 
                  />
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Skeleton 
                        variant="text" 
                        width={100} 
                        height={20} 
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Skeleton 
                        variant="text" 
                        width={100} 
                        height={20} 
                      />
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "grey.200",
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    minWidth: 120,
                  }}
                >
                  <Skeleton 
                    variant="text" 
                    width={80} 
                    height={24} 
                  />
                </Box>
              </Box>

              {/* Collapsed content skeleton */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  mb: 2,
                  borderRadius: "0 0 10px 10px",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Skeleton 
                    variant="text" 
                    width={150} 
                    height={24} 
                    sx={{ mb: 1 }} 
                  />
                  {[1, 2].map((expense) => (
                    <Box key={expense} sx={{ mb: 2, pl: 2 }}>
                      <Skeleton 
                        variant="text" 
                        width={200} 
                        height={20} 
                        sx={{ mb: 0.5 }} 
                      />
                      <Skeleton 
                        variant="text" 
                        width={160} 
                        height={20} 
                        sx={{ pl: 1 }} 
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Skeleton 
                    variant="text" 
                    width={150} 
                    height={24} 
                    sx={{ mb: 1 }} 
                  />
                  {[1, 2].map((expense) => (
                    <Box key={expense} sx={{ mb: 2, pl: 2 }}>
                      <Skeleton 
                        variant="text" 
                        width={200} 
                        height={20} 
                        sx={{ mb: 0.5 }} 
                      />
                      <Skeleton 
                        variant="text" 
                        width={160} 
                        height={20} 
                        sx={{ pl: 1 }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}