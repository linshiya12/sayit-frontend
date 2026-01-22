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
import { Chat } from './pages/Chat';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Directory } from './pages/Directory';
import { PostManagement } from './pages/admin/PostManagement';
import Calls from './pages/Calls';

function App() {
  const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <UserProtectedRoute />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "settings", element: <Settings /> },
        { path: "profile", element: <Profile /> },
        { path: "profile/:id", element: <Profile /> },
        { path: "reels", element: <Reels /> },
        { path: "chats", element: <Chat /> },
        { path: "chats/:roomName", element:<Chat/>},
        { path: "directory", element: <Directory /> },
        { path: "calls", element:<Calls/>}
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
            {path:"posts", element:<PostManagement />}
          ],
        },
      ],
    },
    { path: "/otp", element: <OTPVerification /> },
    { path: "/onboarding", element: <Onboarding /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/adminlogin", element: <Login /> },
    { path: "/forgot-password-otp", element: <ForgotPasswordOTP /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "*", element: <Navigate to="/signup" replace /> },
  ]);
  console.log(import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID);

  return (
    <>
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID} >
    <Provider store={store}>
    <Toaster/>
    <AuthInitializer>
    <RouterProvider router={appRouter}/>
    </AuthInitializer>
    </Provider>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
