import React from "react";
import { Typography, Slider, Box, Paper, Button } from "@mui/material";

interface PreferencesProps {
  preferences: { [key: string]: number };
  onPreferenceChange: (name: string, newValue: number) => void;
  onResetPreferences: () => void;
}

/**
 * Preferences component provides a user interface for setting various preferences
 * using sliders. Each preference can be adjusted between 0 and 1, influencing how
 * providers are ranked and selected.
 *
 * @param preferences - Current values of all preferences.
 * @param onPreferenceChange - Callback to update a preference's value.
 * @param onResetPreferences - Callback to reset all preferences to default values.
 */
const Preferences: React.FC<PreferencesProps> = ({
  preferences,
  onPreferenceChange,
  onResetPreferences,
}) => {
  /**
   * Handles slider value change, passing the new value up to the parent component
   * via the onPreferenceChange callback.
   *
   * @param name - The key of the preference being changed.
   */
  const handleSliderChange =
    (name: string) => (_event: Event, newValue: number | number[]) => {
      onPreferenceChange(name, newValue as number);
    };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Configure Your Preferences
      </Typography>
      <Typography paragraph>
        Below are sliders for each preference related to provider selection.
        Each slider represents a preference attribute. Drag the slider to set
        its value between 0 and 1, where 0 means this factor is not considered
        at all, and 1 means it's highly prioritized. Your settings influence how
        providers are ranked and selected for jobs.
      </Typography>
      <Box sx={{ width: "100%", mb: 2 }}>
        {Object.keys(preferences).map((key) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography id={`${key}-slider`} gutterBottom>
              {key.charAt(0).toUpperCase() +
                key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </Typography>
            <Slider
              value={preferences[key]}
              onChange={handleSliderChange(key)}
              aria-labelledby={`${key}-slider`}
              valueLabelDisplay="on"
              step={0.01}
              marks
              min={0}
              max={1}
            />
          </Box>
        ))}
      </Box>
      <Button variant="outlined" color="primary" onClick={onResetPreferences}>
        Reset Preferences
      </Button>
      <Typography paragraph sx={{ mt: 2 }}>
        Click "Reset Preferences" to restore all settings to their default
        values.
      </Typography>
    </Paper>
  );
};

export default Preferences;
