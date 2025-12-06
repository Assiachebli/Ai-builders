import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import HomeDashboard from './pages/HomeDashboard';
import PoliciesUpload from './pages/PoliciesUpload';
import PoliciesCompare from './pages/PoliciesCompare';
import ChatARCA from './pages/ChatARCA';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<HomeDashboard />} />
                <Route path="/upload" element={<PoliciesUpload />} />
                <Route path="/compare" element={<PoliciesCompare />} />
                <Route path="/chat" element={<ChatARCA />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Redirect root to login for now */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
