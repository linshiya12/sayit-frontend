import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />; 
    }

    if (!user.is_superuser) {
        return <Navigate to="/" replace />; 
    }

    return <Outlet />; 
};

export default AdminProtectedRoute;
