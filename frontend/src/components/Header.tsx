import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Header component that displays a navigation bar with a logo, title, and
 * ensures responsive layout changes based on screen size.
 */
const Header = () => {
  /** Determine if the current screen width is 'small' or below (mobile view) */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      data-testid="header"
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "primary.main",
        paddingY: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton edge="start" aria-label="menu" component={Link} to="/">
          <img src="steno-nav.svg" alt="Steno Logo" style={{ width: 75 }} />
        </IconButton>
        <div style={{ textAlign: "center" }}>
          <Typography variant={isMobile ? "h6" : "h5"} component="div">
            Steno Job & Provider Ranking Analysis
          </Typography>
          <Typography
            variant={isMobile ? "caption" : "subtitle2"}
            component="div"
            sx={{ fontStyle: "italic" }}
          >
            By Kristoffer Stobbe
          </Typography>
        </div>
        <div style={{ width: 75 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
