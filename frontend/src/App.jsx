import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserStoryDetail from "./pages/UserStoryDetail";
import CreateProject from "./pages/CreateProject";
import Backlog from "./pages/Backlog";
import EditProject from './pages/EditProject';
import ManageMembers from './pages/ManageMembers';
import BoardPage from './pages/Board';
import StandupPage from './pages/StandupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userstory/:id" element={<UserStoryDetail />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/projects/:projectId/backlog" element={<Backlog />} />
        <Route path="/projects/:projectId/board" element={<BoardPage />} />
        <Route path="/projects/:projectId/members" element={<ManageMembers />} />
        <Route path="/projects/:projectId/standup" element={<StandupPage />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/backlog" element={<Backlog />} />
        <Route path="/board" element={<BoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
