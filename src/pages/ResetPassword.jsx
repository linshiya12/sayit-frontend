import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useNavigate,useLocation } from "react-router-dom";
import { toast } from "sonner";
import AxiosInstance from "@/api/axiosInstance";
import { ArrowLeft } from "lucide-react";

export function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation()
    const reset_token = location.state?.resetToken
    const passwordref = useRef()
    const confirmpassref=useRef()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reset_token) {
        toast.error("Reset session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
        }

        try{
        const data={"password":passwordref.current.value,"confirm_password":confirmpassref.current.value,"reset_token":reset_token}
        const response=await AxiosInstance.post(
            "auth/Password_Change/",data
        )
        console.log(response)
        toast.success("password changed successfully!")
        navigate("/login",{replace:true});

        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "network error")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8">
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4"
                    onClick={() => navigate("/login")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Reset Password</h1>
                    <p className="text-muted-foreground text-sm">Create a new password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">New Password</label>
                            <Input type="password" required className="h-11" ref={passwordref} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Confirm New Password</label>
                            <Input type="password" ref={confirmpassref} required className="h-11" />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                        <h4 className="text-blue-700 font-semibold text-sm">Password Requirements:</h4>
                        <ul className="space-y-1">
                            <li className="flex items-center gap-2 text-sm text-blue-600">
                                <Check className="h-4 w-4 text-emerald-500" /> Minimum 8 characters
                            </li>
                            <li className="flex items-center gap-2 text-sm text-blue-600">
                                <Check className="h-4 w-4 text-emerald-500" /> At least one uppercase letter
                            </li>
                            <li className="flex items-center gap-2 text-sm text-blue-600">
                                <Check className="h-4 w-4 text-emerald-500" /> At least one number
                            </li>
                            <li className="flex items-center gap-2 text-sm text-blue-600">
                                <Check className="h-4 w-4 text-emerald-500" /> At least one special character
                            </li>
                        </ul>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 bg-blue-600 hover:bg-blue-700">
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
