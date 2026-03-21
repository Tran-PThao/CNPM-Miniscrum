import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserStoryDetail from "./pages/UserStoryDetail";
import CreateProject from "./pages/CreateProject";
import Backlog from "./pages/Backlog";

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
      </Routes>
    </Router>
  );
}

export default App;
