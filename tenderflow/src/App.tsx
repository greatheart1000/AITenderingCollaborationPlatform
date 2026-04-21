import {Navigate, Route, Routes} from 'react-router-dom';
import {AppShell} from './layout/AppShell';
import {CompliancePage} from './pages/CompliancePage';
import {DashboardPage} from './pages/DashboardPage';
import {DocumentAnalysisPage} from './pages/DocumentAnalysisPage';
import {ExportCenterPage} from './pages/ExportCenterPage';
import {MaterialMatchingPage} from './pages/MaterialMatchingPage';
import {ProjectCommandPage} from './pages/ProjectCommandPage';
import {ProjectListPage} from './pages/ProjectListPage';
import {RiskAuditPage} from './pages/RiskAuditPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/:projectId" element={<Navigate to="command" replace />} />
        <Route path="projects/:projectId/command" element={<ProjectCommandPage />} />
        <Route path="projects/:projectId/analysis" element={<DocumentAnalysisPage />} />
        <Route path="projects/:projectId/compliance" element={<CompliancePage />} />
        <Route path="projects/:projectId/matching" element={<MaterialMatchingPage />} />
        <Route path="projects/:projectId/risk" element={<RiskAuditPage />} />
        <Route path="projects/:projectId/export" element={<ExportCenterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
