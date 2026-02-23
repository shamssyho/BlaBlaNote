import { AuthProvider } from '../modules/auth/auth.context';
import { AppRouter } from '../router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
