import { Routes, Route, useLocation } from "react-router-dom";
import Search from "./components/Home";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home/HomePage";
import Saved from "./pages/Saved/SavedPage";
import Profile from "./pages/Profile/ProfilePage";
import Discover from "./pages/Discover/DiscoverPage";
import Projects from "./pages/Project/ProjectPage";
import CreateModal from "./components/create/CreateModel";
import SettingsModal from "./components/settings/SettingsModal";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProjectPage from "./pages/Project/ProjectPage";

function App() {
  const location = useLocation();

  const state = location.state as {
    background?: Location;
  };

  return (
    <>
      <Routes location={state?.background || location}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Route>
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/create" element={<CreateModal />} />
          <Route path="/settings" element={<SettingsModal />} />
        </Routes>
      )}
    </>
  );
}

export default App;
