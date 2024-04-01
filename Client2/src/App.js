import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Prof from "./pages/Prof";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Prof" element={<Prof />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/NotFoundPage" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
