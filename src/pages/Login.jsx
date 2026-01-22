import React,{ useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { ArrowRight } from "lucide-react";
import AxiosInstance from "@/api/axiosInstance";
import { useRef } from "react";
import { toast } from "sonner";
import { loginSuccess } from "@/utils/reduxstores/Authslice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { GoogleLogin } from "@react-oauth/google";

export function Login() {
    const navigate = useNavigate();
    const passwordref=useRef()
    const dispatch=useDispatch()
    const [email,setEmail]=useState("")
    const handleSubmit = async(e) => {
        e.preventDefault();
        const data={"email":email,"password":passwordref.current.value}
        try{
            const response=await AxiosInstance.post("auth/login/",data)
            dispatch(loginSuccess({
                accessToken: response.data.access,
                user: response.data.user,
            }))
            console.log("res",response)            
            navigate("/",{replace:true});
            toast.success("login successfully!")

        }catch(error){
            console.log(error);

            const errData = error.response?.data;

            const message =
                errData?.error ||
                errData?.non_field_errors?.[0] ||
                errData?.detail ||
                errData?.message ||
                "Network error";

            toast.error(message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const data={"email":email}
        if (!email) {
            toast.error("Email is required");
            return;
            }
        try{
            const response=await AxiosInstance.post("auth/forgot-password-otp/",data)
            toast.success("OTP sent successfully")
            localStorage.setItem(
                `otpSentTime_${data.email}`,
                Date.now().toString()
                );
            navigate("/forgot-password-otp",{ state: { email: email,fromSignup: true },replace: true });
        }catch(error){
            console.log(error)
            toast.error(error.response?.data?.message || error.response?.data?.error ||"Network error")
        }
            
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background ">
            <div className="w-full max-w-md space-y-8 border-2 border-blue-800/25 p-8 bg-white">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to continue to LinguaConnect.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* <Button variant="outline" type="button" className="w-full h-11 text-base gap-2">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                            <path
                                d="M12.0003 20.45c4.6667 0 8.0953-3.218 8.0953-8.1567 0-.7766-.08-1.4233-.2033-2.02h-7.892v3.74h4.48c-.2867 1.8367-1.84 4.0934-4.48 4.0934-2.73 0-5.0434-1.87-5.8767-4.3834l-3.9533 3.0334c1.92 3.78 5.8633 6.36 10.5133 6.36z"
                                fill="#34A853"
                            />
                            <path
                                d="M6.1237 13.7233C5.9037 13.07 5.7837 12.3733 5.7837 11.65c0-.7233.12-1.42.34-2.0733l-3.9534-3.0334C1.3303 8.1633.7837 9.8333.7837 11.65s.5466 3.4867 1.3866 5.1067l3.9534-3.0334z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0003 5.9c2.4234 0 4.2234 1.0533 5.1634 1.93l2.87-2.87C18.2537 3.2833 15.6037 2.05 12.0003 2.05c-4.65 0-8.5933 2.58-10.5133 6.36l3.9533 3.0333c.8333-2.5133 3.1467-4.3833 5.8767-4.3833z"
                                fill="#EA4335"
                            />
                            <path
                                d="M24.0003 12c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12z"
                                fill="none"
                            />
                        </svg>
                        Sign in with Google
                    </Button> */}
                    <div className="flex justify-center">
  <GoogleLogin
    onSuccess={async (response) => {
      try {
        const res = await AxiosInstance.post(
          "auth/google/",
          { token: response.credential },
          { withCredentials: true }
        );

        dispatch(loginSuccess({
          accessToken: res.data.access,
          user: res.data.user,
        }));

        if (!res.data.user.is_onboarded) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        toast.success("Login successful");
      } catch (err) {
        console.error(err);
        toast.error("Google login failed");
      }
    }}
    onError={() => toast.error("Google login failed")}
  />
</div>


                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                Email
                            </label>
                            <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className={cn(
                                        "text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                        email
                                            ? "text-primary hover:underline cursor-pointer"
                                            : "text-muted-foreground cursor-not-allowed"
                                    )}
                                    disabled={!email}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input id="password" type="password" ref={passwordref} placeholder="••••••••" required className="h-11" />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20">
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-primary hover:underline">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
