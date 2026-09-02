import { Routes, Route, useLocation, type Location } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home/HomePage";
import Saved from "./pages/Saved/SavedPage";
import Profile from "./pages/Profile/ProfilePage";
import Discover from "./pages/Discover/DiscoverPage";
import Projects from "./pages/Projects/ProjectsPage";
import CreateModal from "./components/create/CreateModel";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProjectPage from "./pages/Project/ProjectPage";
import PrivacyPage from "./pages/Settings/Privacy/PrivacyPage";
import DocsPage from "./pages/Docs/DocsPage";
import FeedbackPage from "./pages/Feedback/FeedbackPage";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import EditProjectPage from "./pages/Edit/EditProjectPage";
import WelcomePage from "./pages/Welcome/WelcomePage";

function App() {
  const location = useLocation();

  const state = location.state as {
    background?: Location;
  };

  return (
    <>
      <Routes location={state?.background || location}>
        {/* Public Routes */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* App Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/saved" element={<Saved />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id/edit" element={<EditProjectPage />} />
            <Route path="/settings/privacy" element={<PrivacyPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Route>
        </Route>
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/create" element={<CreateModal />} />
        </Routes>
      )}
    </>
  );
}

export default App;
