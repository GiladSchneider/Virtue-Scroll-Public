import { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import { VirtueList, CreateVirtueForm } from "../components";
import { Virtue } from "../types";
import { config } from "../config";

const HomePage = () => {
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVirtues = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/virtues`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch virtues");
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return [];
    }
  }, []);

  const loadVirtues = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const fetchedVirtues = await fetchVirtues();
    setVirtues(fetchedVirtues);
    setLoading(false);
    setInitialLoad(false);
  }, [fetchVirtues, loading]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        // Add more virtues when scrolling
        const loadMore = async () => {
          if (loading) return;
          setLoading(true);
          const newVirtues = await fetchVirtues();
          setVirtues((prev) => [...prev, ...newVirtues]);
          setLoading(false);
        };
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchVirtues, loading]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      loadVirtues();
    }
  }, [loadVirtues, initialLoad]);

  const handleVirtueCreated = () => {
    loadVirtues();
  };

  if (initialLoad) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        p={2}
      >
        <Typography
          color="error"
          variant="h6"
          textAlign="center"
          sx={{ maxWidth: 400 }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
        <CreateVirtueForm onVirtueCreated={handleVirtueCreated} />
        <VirtueList virtues={virtues} />
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={30} thickness={4} />
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default HomePage;
