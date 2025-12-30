import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import Library from "./pages/Library/Library";
import Assessment from "./pages/IncidentAnalysis/IncidentAnalysis";
import Dictionary from "./pages/Dictionary/Dictionary";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import PathDetail from "./pages/PathDetail/PathDetail";
import TacticDetail from "./pages/TacticDetail/TacticDetail";
import LessonDetail from "./pages/LessonDetail/LessonDetail";
import SIEMAssessment from "./pages/SiemAssessment/SiemAssessment";

import Layout from "./components/Layout/Layout";
import SIEM from "./components/SIEM/SIEM";

function App() {
  return (
    <Routes>
      {/* Optional login page */}
      <Route path="/login" element={<Login />} />

      {/* Layout routes */}
      <Route element={<Layout />}>
        <Route path="/landing" element={<Landing />} />
        <Route path="/library" element={<Library />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/Siem_assessment" element={<SIEMAssessment />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/paths/:id" element={<PathDetail />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/dictionary/:id" element={<TacticDetail />} />
      </Route>

      {/* Fullscreen – no layout */}
      <Route path="/siem/:id" element={<SIEM />} />

      {/* Defaults */}
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

export default App;
