import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.is_superuser) {
        return <Navigate to="/admin" replace />; 
    }

    return <Outlet />; // render normal user routes
};

export default UserProtectedRoute;
