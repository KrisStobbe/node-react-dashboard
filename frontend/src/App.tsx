import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import FindProvider from "./pages/FindProvider";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { Container } from "@mui/material";
import "./global.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        data-testid="app"
        maxWidth={false}
        sx={{
          backgroundColor: "primary.main",
        }}
      >
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<FindProvider />} />
            <Route path="/find-provider" element={<FindProvider />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
