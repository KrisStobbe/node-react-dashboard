import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * NotFound component that displays a user-friendly error message when a page is not found.
 */
const NotFound: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="primary.main"
      data-testid="not-found"
    >
      <Typography variant="h4" color="white">
        404 - Page Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;
