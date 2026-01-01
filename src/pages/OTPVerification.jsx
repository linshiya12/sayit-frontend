import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Import } from "lucide-react";
import { InputOTP,InputOTPGroup,InputOTPSlot, } from "@/components/ui/input-otp";
import AxiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/utils/reduxstores/Authslice";


export function OTPVerification() {
    const navigate = useNavigate();
    const otpref=useRef()
    const [loading,setLoading]=useState(false)
    const [resendloading,setresendLoading]=useState(false)
    const location = useLocation();
    const email = location.state?.email;
    const fromSignup = location.state?.fromSignup;
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resendTrigger, setResendTrigger] = useState(0);
    const dispatch=useDispatch()

    useEffect(() => {
        if (!email || !fromSignup ) {
            localStorage.removeItem(`otpSentTime_${email}`);
            toast.error("Email is required for verification");
            navigate("/signup", { replace: true });
            return;
        }

        let timer;
        let initialTimeLeft = 60;
        const savedTime = localStorage.getItem(`otpSentTime_${email}`);

        // --- Initial Time Calculation ---
        if (savedTime) {
            const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000); 
            const remaining = 60 - elapsed;

            if (remaining > 0) {
                initialTimeLeft = remaining;
                setCanResend(false);
            } else {
                initialTimeLeft = 0;
                setCanResend(true);
                localStorage.removeItem(`otpSentTime_${email}`);
            }
        } else if (resendTrigger === 0) {
            // Set timestamp only on first load
            localStorage.setItem(`otpSentTime_${email}`, Date.now().toString());
            initialTimeLeft = 60;
            setCanResend(false);
        } else {
            // If resendTrigger > 0, we rely on the timestamp set in handleResend,
            // and the timer is explicitly starting from 60 due to the re-run.
            initialTimeLeft = 60;
        }

        setTimeLeft(initialTimeLeft);
        
        // --- Start Countdown ---
        if (initialTimeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true); 
                        localStorage.removeItem(`otpSentTime_${email}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setCanResend(true);
        }

        // Cleanup: This runs when the component unmounts OR when dependencies change (i.e., resendTrigger changes)
        return () => clearInterval(timer);
    // 2. DEPENDENCY ARRAY: Watching the trigger forces the timer to reset
    }, [email, navigate, resendTrigger, fromSignup]);


    const handleVerify = async() => {
        const data = { otp: otpref.current.value , email:email};
        console.log(data)
        setLoading(true)
        try{
            const response=await AxiosInstance.post("auth/verify_otp/",data)
            localStorage.removeItem(`otpSentTime_${email}`);
            console.log("res",response)
            dispatch(loginSuccess({
                accessToken: response.data.access,
                user: response.data.user,
            }))
            toast.success("emailvarified successfully")
            navigate("/onboarding",{replace:true});

        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "OTP verification failed")
        }finally{
            setLoading(false)
        }
    };

    const handleResend = async() => {
        const email = location.state?.email;
        const data = {email:email};
        console.log(data)
        setresendLoading(true)
        try{
            const response=await AxiosInstance.post("auth/resend_otp/",data)
            toast.success("OTP sent again!");
            localStorage.setItem(`otpSentTime_${email}`, Date.now().toString());
            setResendTrigger(prev => prev + 1);

        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "failed to resend otp")
        }finally{
            setresendLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-sm space-y-8 text-center">
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4"
                    onClick={() => navigate("/signup", { replace: true })}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Verify it's you</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the 6-digit code sent to your email.
                    </p>
                </div>

                <div className="flex justify-center py-4">
                    <InputOTP maxLength={6} ref={otpref}>
                        <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="h-12 w-10 md:w-12 rounded-md border" />
                            <InputOTPSlot index={1} className="h-12 w-10 md:w-12 rounded-md border" />
                            <InputOTPSlot index={2} className="h-12 w-10 md:w-12 rounded-md border" />
                            <InputOTPSlot index={3} className="h-12 w-10 md:w-12 rounded-md border" />
                            <InputOTPSlot index={4} className="h-12 w-10 md:w-12 rounded-md border" />
                            <InputOTPSlot index={5} className="h-12 w-10 md:w-12 rounded-md border" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="space-y-4">
                    <Button onClick={handleVerify} className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </Button>
                    
                    <p className="text-sm font-medium text-muted-foreground">
                    {canResend ? (
                        <span className="text-green-600">You can resend OTP now</span>
                    ) : (
                        <span>Resend in <span className="text-primary">{timeLeft}s</span></span>
                    )}
                    </p>
                    <Button
                        variant="link"
                        onClick={handleResend}
                        className="text-sm text-muted-foreground font-normal"
                        disabled={!canResend || resendloading}
                        >
                        {resendloading ? (
                            <span className="text-primary font-semibold ml-1">sending...</span>
                        ) : (
                            <>
                            Didn't receive code?
                            <span className={`ml-1 font-semibold ${canResend ? "text-primary" : "text-gray-400"}`}>
                                Resend
                            </span>
                            </>
                        )}
                    </Button>

                </div>
            </div>
        </div>
    );
}
