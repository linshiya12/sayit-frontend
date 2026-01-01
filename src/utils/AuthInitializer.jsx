import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AxiosInstance from "@/api/axiosInstance";
import { loginSuccess, logout } from "./reduxstores/Authslice";
import { baseURL } from "./constants";
import { toast } from "sonner";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // show spinner until auth is checked

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const res = await AxiosInstance.post(`${baseURL}/token/refresh/`, {}, { withCredentials: true });
        dispatch(
          loginSuccess({
            accessToken: res.data.access,
            user: res.data.user,
          })
        );
      } catch (err) {
        // Don't immediately log out; just leave user as null
        console.log("No valid refresh token found, user not logged in.");
      } finally {
        setLoading(false); // stop showing loading
      }
    };

    restoreAuth();
  }, [dispatch]);

  if (loading) {
    // Prevent the app from rendering until auth check is done
    return <div>Loading...</div>; 
  }

  return children;
};

export default AuthInitializer;
