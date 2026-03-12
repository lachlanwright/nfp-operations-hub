import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { MemberIntakePage } from './pages/MemberIntakePage';
import { VolunteerMatchingPage } from './pages/VolunteerMatchingPage';
import { IntegrationPage } from './pages/IntegrationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="intake" element={<MemberIntakePage />} />
          <Route path="volunteers" element={<VolunteerMatchingPage />} />
          <Route path="integration" element={<IntegrationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

