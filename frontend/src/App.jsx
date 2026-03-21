import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserStoryDetail from './pages/UserStoryDetail';
// Thêm sau: ProjectDetail

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />           {/* Default: Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userstory/:id" element={<UserStoryDetail />} />
        {/* Sau này thêm: /project/:id */}
      </Routes>
    </Router>
  );
}

export default App;