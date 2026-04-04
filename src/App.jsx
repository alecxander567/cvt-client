import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import HomePage from "./pages/Home";
import AlbumsPage from "./pages/Albums";
import CategoriesPage from "./pages/Categories";
import HistoryPage from "./pages/History";
import ArchivePage from "./pages/Archive";
import ProfileSettingsPage from "./pages/ProfileSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
