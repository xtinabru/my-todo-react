import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './screens/Home';
import Authentication, { AuthenticationMode } from './screens/Authentication';
import ErrorPage from './screens/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider from './context/userProvider';

// Настройка маршрутов
const router = createBrowserRouter([
  { errorElement: <ErrorPage /> },
  { 
    path: "/signin",
    element: <Authentication authenticationMode={AuthenticationMode.Login} />
  },
  { 
    path: "/signup",
    element: <Authentication authenticationMode={AuthenticationMode.Register} />
  },
  { 
    element: <ProtectedRoute />,
    children: [
      { 
        path: "/",
        element: <Home /> 
      }
    ]
  }
]);

// Инициализация корневого элемента и рендеринг приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* Оборачиваем RouterProvider в UserProvider */}
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
