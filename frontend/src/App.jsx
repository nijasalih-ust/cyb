import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import Library from "./pages/Library/Library";
import Assessment from "./pages/IncidentAnalysis/IncidentAnalysis";
import Dictionary from "./pages/Dictionary/Dictionary";
// import NavigationPage from "./pages/Navigation/NavigationPage";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
// import Arsenal from "./pages/Arsenal/Arsenal";
import PathDetail from "./pages/PathDetail/PathDetail";
import TacticDetail from "./pages/TacticDetail/TacticDetail";
import LessonDetail from "./pages/LessonDetail/LessonDetail";

// ... imports

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout><Outlet /></Layout>}> {/* Layout Wrapper */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/library" element={<Library />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dictionary" element={<Dictionary />} />
            {/* <Route path="/arsenal" element={<Arsenal />} /> REMOVED */}
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/paths/:id" element={<PathDetail />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/dictionary/:id" element={<TacticDetail />} />
            {/* Add other protected routes here */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
