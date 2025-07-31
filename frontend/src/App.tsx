import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/router/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import FallbackRedirect from './components/router/FallbackRedirect';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<FallbackRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
