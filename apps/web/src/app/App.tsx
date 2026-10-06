import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../routes/DashboardPage';
import { AuthPage } from '../routes/AuthPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
