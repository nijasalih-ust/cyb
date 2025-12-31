import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import SIEM from "./components/SIEM/SIEM";

// Lazy Load Pages
const Login = React.lazy(() => import("./pages/Login/Login"));
const Landing = React.lazy(() => import("./pages/Landing/Landing"));
const Library = React.lazy(() => import("./pages/Library/Library"));
const Assessment = React.lazy(() => import("./pages/IncidentAnalysis/IncidentAnalysis"));
const Dictionary = React.lazy(() => import("./pages/Dictionary/Dictionary"));
const ArticleDetail = React.lazy(() => import("./pages/ArticleDetail/ArticleDetail"));
const PathDetail = React.lazy(() => import("./pages/PathDetail/PathDetail"));
const TacticDetail = React.lazy(() => import("./pages/TacticDetail/TacticDetail"));
const LessonDetail = React.lazy(() => import("./pages/LessonDetail/LessonDetail"));
const SIEMAssessment = React.lazy(() => import("./pages/SiemAssessment/SiemAssessment"));
const TechniquePage = React.lazy(() => import("./pages/TechniquePage/TechniquePage"));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyber-blue font-mono">
    <div className="w-12 h-12 border-4 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mb-4" />
    <span className="animate-pulse">Establishing Uplink...</span>
  </div>
);
function App() {
  return (
    <AuthProvider>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>

            {/* With Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Landing />} />
              <Route path="/learning-paths" element={<Library />} />
              <Route path="/quiz-practice" element={<Assessment />} />
              <Route path="/tactics-library" element={<Dictionary />} />
              <Route path="/siem-practice" element={<SIEMAssessment />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/paths/:id" element={<PathDetail />} />
              <Route path="/lessons/:id" element={<LessonDetail />} />
              <Route path="/tactics-library/:id" element={<TacticDetail />} />
              <Route path="/techniques/:id" element={<TechniquePage />} />
            </Route>

            {/* Fullscreen */}
            <Route path="/siem/:id" element={<SIEM />} />
          </Route>

          {/* Defaults */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </React.Suspense>
    </AuthProvider>
  );
}


export default App;
