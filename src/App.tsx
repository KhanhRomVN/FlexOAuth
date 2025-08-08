import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewTabPage from "./pages/BookmarkManager";
import Popup from "./components/popup/Popup";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/newtab" element={<NewTabPage />} />
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </Router>
  );
};

export default App;
