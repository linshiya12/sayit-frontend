import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import AxiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { useSelector,useDispatch } from "react-redux";
import { loginSuccess } from "@/utils/reduxstores/Authslice";

export function Signup() {
    const navigate = useNavigate();
    const first_nameRef=useRef(null)
    const last_nameRef=useRef(null)
    const passwordRef=useRef(null)
    const confirm_passRef=useRef(null)
    const emailRef=useRef(null)
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()

    const handleSubmit = async(e) => {
        e.preventDefault();
        // In a real app, we would handle signup logic here
        const data={
            first_name:first_nameRef.current.value,
            last_name:last_nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
            confirm_password:confirm_passRef.current.value,
        }
        console.log("Sending:",data);
        setLoading(true);
        try{
            const response = await AxiosInstance.post("auth/signup/",data);
            console.log("res",response)
            toast.success("Signup successful!");
            localStorage.setItem(
                `otpSentTime_${data.email}`,
                Date.now().toString()
                );

            navigate("/otp", { state: { email: data.email,fromSignup: true },replace: true });

        }catch(error){
            console.log(error)
            toast.error(error.response?.data?.email?.[0] || error.response?.data?.message ||error.response?.data?.non_field_errors?.[0] || "Network error",{ position: "top-right" })
        }finally{
            setLoading(false)
        }
        
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 border-2 border-blue-800/25 p-5 bg-white">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary/5 p-3 rounded-2xl">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter">Create Account</h1>
                    <p className="text-muted-foreground text-sm">
                        Join LinguaConnect and start your journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Button variant="outline" type="button" className="w-full h-11 text-base gap-2">
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
                        Sign up with Google
                    </Button>

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
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="first_name">
                                First Name
                            </label>
                            <Input id="first_name" name="firstname" ref={first_nameRef} placeholder="John Doe" required className="h-11"/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="last_name">
                                Last Name
                            </label>
                            <Input id="last_name" placeholder="John Doe" required className="h-11" ref={last_nameRef} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                Email
                            </label>
                            <Input id="email" type="email" placeholder="john@example.com" required className="h-11" ref={emailRef}/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Password
                            </label>
                            <Input id="password" type="password" placeholder="••••••••" required className="h-11" ref={passwordRef}/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="new_password">
                                Confirm Password
                            </label>
                            <Input id="new_password" type="password" placeholder="••••••••" required className="h-11" ref={confirm_passRef} />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? "Signing up..." : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
