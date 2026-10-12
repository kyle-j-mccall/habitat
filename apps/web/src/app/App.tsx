import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../routes/DashboardPage';
import { AuthPage } from '../routes/AuthPage';
import { EnclosuresPage } from '../routes/EnclosuresPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RedirectIfSignedIn } from './RedirectIfSignedIn';

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/enclosures"
        element={
          <ProtectedRoute>
            <EnclosuresPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <RedirectIfSignedIn>
            <AuthPage />
          </RedirectIfSignedIn>
        }
      />
    </Routes>
  );
}
