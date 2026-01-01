import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import { RouterProvider,createBrowserRouter,Navigate } from "react-router-dom"
import { OTPVerification } from './pages/OTPVerification';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Toaster } from "sonner";
import { Login } from './pages/Login';
import { store } from './utils/reduxstores/Store';
import { Provider } from 'react-redux';
import { Settings } from './pages/Settings';
import AuthInitializer from './utils/AuthInitializer';
import { ForgotPasswordOTP } from './pages/ForgotPasswordOTP';
import { ResetPassword } from './pages/ResetPassword';
import { AdminLayout } from './components/admin/AdminLayout';
import { UserManagement } from './pages/admin/UserManagement';
import UserProtectedRoute from './routes/UserProtectedRoute';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import { Profile } from './pages/Profile';
import { Reels } from './pages/Reels';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <UserProtectedRoute />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "settings", element: <Settings /> },
        { path: "profile", element: <Profile /> },
        { path: "reels", element: <Reels /> }
      ],
    },
    {
      path: "/admin",
      element: <AdminProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <Navigate to="/admin/users" replace /> },
            { path: "users", element: <UserManagement /> },
          ],
        },
      ],
    },
    { path: "/otp", element: <OTPVerification /> },
    { path: "/onboarding", element: <Onboarding /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password-otp", element: <ForgotPasswordOTP /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "*", element: <Navigate to="/signup" replace /> },
  ]);

  return (
    <>
    <Provider store={store}>
    <Toaster/>
    <AuthInitializer>
    <RouterProvider router={appRouter}/>
    </AuthInitializer>
    </Provider>
    </>
  )
}

export default App
