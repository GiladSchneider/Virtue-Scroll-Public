import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getUser } from "../helpers";
import { useEffect, useState } from "react";
import { User } from "../types";

const Profile = () => {
  const { user, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.sub) {
        return;
      }
      const data = await getUser(user.sub);
      setUserInfo(data);
    };

    fetchUserInfo();
  }, [user?.sub]);

  if (isLoading || !userInfo) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 3, pb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              bgcolor: "primary.main",
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            {userInfo?.displayName[0]}
          </Avatar>

          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
              }}
            >
              {userInfo?.displayName}
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              @{userInfo?.username}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {userInfo?.email}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
