import { Suspense } from 'react';
import { AuthProvider } from '../modules/auth/auth.context';
import { AppRouter } from '../router/AppRouter';

export default function App() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-600">Loading...</div>}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Suspense>
  );
}
