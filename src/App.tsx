// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Layout } from "./components";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MyProfile from "./pages/MyProfile";
import { Auth0Provider } from "@auth0/auth0-react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

function App() {
  return (
    <Auth0Provider
      domain="dev-6q6gfnsktyxcf0bj.us.auth0.com"
      clientId="2ykY7uEWmiS0SVkcMO8gC957upyy3iEJ"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-6q6gfnsktyxcf0bj.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata",
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/me" element={<MyProfile />} />
              <Route path="*" element={<div>Not found</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
