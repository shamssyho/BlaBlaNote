import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Notes } from './features/notes/pages/notes';

export default function app() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/notes',
      element: <Notes />,
    },
  ]);

  return (
    <div>
      <h1>BlaBla Note</h1>
      <RouterProvider router={router} />
    </div>
  );
}
