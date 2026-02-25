import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import AgentWorkspaceRoute from './pages/AgentWorkspaceRoute';
import TemplateRoute from './pages/TemplateRoute';
import SkillRoute from './pages/SkillRoute';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StoreFront />} />
                <Route path="/agents/:id" element={<AgentWorkspaceRoute />} />
                <Route path="/templates/:id" element={<TemplateRoute />} />
                <Route path="/skills/:id" element={<SkillRoute />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
