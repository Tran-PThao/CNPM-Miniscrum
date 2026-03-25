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
        <Route path="/backlog" element={<Backlog />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/projects/:projectId/members" element={<ManageMembers />} />
      </Routes>
    </Router>
  );
}

export default App;
