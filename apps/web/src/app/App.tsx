import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../routes/HomePage';
import { DashboardPage } from '../routes/DashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
