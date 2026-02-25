import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LabourOverview from './pages/LabourOverview';
import Recruitment from './pages/Recruitment';
import EmployeeRelations from './pages/EmployeeRelations';
import CriticalSkills from './pages/CriticalSkills';
import ShaftFocus from './pages/ShaftFocus';
import KPIs from './pages/KPIs';
import DataUpload from './pages/DataUpload';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="labour" element={<LabourOverview />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="employee-relations" element={<EmployeeRelations />} />
        <Route path="critical-skills" element={<CriticalSkills />} />
        <Route path="shafts" element={<ShaftFocus />} />
        <Route path="kpis" element={<KPIs />} />
        <Route path="upload" element={<DataUpload />} />
      </Route>
    </Routes>
  );
}
