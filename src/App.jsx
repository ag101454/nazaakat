import { BrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingScreen from './animations/loadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}