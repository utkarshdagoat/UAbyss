import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Governance from "./pages/governance";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
