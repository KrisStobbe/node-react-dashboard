import { useState } from "react";
import { Container, Grid, Typography, Box, Paper } from "@mui/material";
import JobList from "../components/JobList";
import ProviderList from "../components/ProviderList";
import Preferences from "../components/Preferences";
import { useJobs } from "../hooks/useJobs";
import { useProviders } from "../hooks/useProviders";

/**
 * The FindProvider component serves as a container for managing and displaying
 * jobs, providers, and preferences for selecting the best provider for a job.
 *
 */
const FindProvider = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { jobs } = useJobs();
  const defaultPreferences = {
    costWeight: 1,
    ratingWeight: 1,
    turnoverWeight: 1,
    proximityWeight: 1,
  };
  const [preferences, setPreferences] = useState(defaultPreferences);
  const { providers } = useProviders(selectedJobId, preferences);

  /**
   * Handles changes to preference sliders, updating the state with new values.
   *
   * @param name - The name of the preference being changed.
   * @param newValue - The new value of the preference.
   */
  const handlePreferenceChange = (name: string, newValue: number) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  /** Resets all preferences to their default values */
  const handleResetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ paddingTop: 2, paddingBottom: 20 }}
      data-testid="find-provider"
    >
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6} data-testid="job-selection-section">
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select an Upcoming Job for Analysis
            </Typography>
            <Box sx={{ overflowY: "auto", height: "40vh", pr: 2 }}>
              <JobList
                jobs={jobs}
                selectedJobId={selectedJobId}
                onSelect={setSelectedJobId}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} data-testid="provider-list-section">
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Providers for Selected Job
            </Typography>
            <Box sx={{ overflowY: "auto", height: "40vh" }}>
              <ProviderList providers={providers} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box data-testid="preferences-section">
        <Preferences
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
          onResetPreferences={handleResetPreferences}
        />
      </Box>
    </Container>
  );
};

export default FindProvider;
