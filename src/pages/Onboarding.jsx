import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, 
} from "@/components/ui/select";
import { replace, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, GraduationCap, School } from "lucide-react";
import { cn } from "@/lib/utils";
import AxiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

const LANGUAGES = [
    "English", "Spanish", "French", "German", "Italian",
    "Japanese", "Chinese", "Russian", "Portuguese", "Korean"
];

export function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: "", // "student" | "mentor"
        native_language: "",
        spoken_languages: [],
        learning_language: "",
        hourlyrate: null,
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleFinish = async () => {
        try{
            const response=await AxiosInstance.post("onboarding/",formData)
            console.log("errff",response)
            
            toast.success("Welcome to SayIt!")
            navigate("/",{replace:true});
        }catch(error){
            console.log("err",error)
            toast.error(error.message||"error")
        }
        
    };

    const updateForm = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const toggleKnownLanguage = (lang) => {
        setFormData((prev) => {
            const current = prev.spoken_languages;
            return current.includes(lang)
                ? { ...prev, spoken_languages: current.filter((l) => l !== lang) }
                : { ...prev, spoken_languages: [...current, lang] };
        });
    };

    // Determine total steps based on role
    // 1: Role, 2: Native, 3: Known, 4: Specific (Target/Rate), 5: Finish? 
    // Actually usually step 4 is the last input step.

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-500">
            <div className="w-full max-w-lg space-y-8">

                {/* Progress Indicator (Optional but nice) */}
                <div className="flex gap-2 mb-8 justify-center">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-2 w-16 rounded-full transition-all duration-300",
                                step >= i ? "bg-primary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>

                {step > 1 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-0 pl-0 hover:bg-transparent hover:text-primary"
                        onClick={prevStep}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                )}

                {/* STEP 1: Role Selection */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">How do you want to use LinguaConnect?</h1>
                            <p className="text-muted-foreground">Select your role to personalize your experience.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RoleCard
                                icon={GraduationCap}
                                title="Student"
                                desc="Learn languages from mentors"
                                selected={formData.role === "student"}
                                onClick={() => updateForm("role", "student")}
                            />
                            <RoleCard
                                icon={School}
                                title="Mentor"
                                desc="Teach your native language"
                                selected={formData.role === "mentor"}
                                onClick={() => updateForm("role", "mentor")}
                            />
                        </div>

                        <Button
                            className="w-full h-12 text-base"
                            disabled={!formData.role}
                            onClick={nextStep}
                        >
                            Next Step
                        </Button>
                    </div>
                )}

                {/* STEP 2: Native Language */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">What is your native language?</h1>
                            <p className="text-muted-foreground">This helps us connect you with the right people.</p>
                        </div>

                        <Select value={formData.native_language} onValueChange={(val) => updateForm("native_language", val)}>
                            <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map(lang => (
                                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            className="w-full h-12 text-base"
                            disabled={!formData.native_language}
                            onClick={nextStep}
                        >
                            Next Step
                        </Button>
                    </div>
                )}

                {/* STEP 3: Known Languages */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Which languages do you speak?</h1>
                            <p className="text-muted-foreground">Select all that apply.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                            {LANGUAGES.map((lang) => (
                                <div key={lang} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleKnownLanguage(lang)}>
                                    <Checkbox
                                        id={`known-${lang}`}
                                        checked={formData.spoken_languages.includes(lang)}
                                        onCheckedChange={() => toggleKnownLanguage(lang)}
                                    />
                                    <label
                                        htmlFor={`known-${lang}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {lang}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full h-12 text-base"
                            onClick={nextStep}
                        >
                            Next Step
                        </Button>
                    </div>
                )}

                {/* STEP 4: Conditional - Student Target Lang OR Mentor Hourly Rate */}
                {step === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {formData.role === "student" ? (
                            <>
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-bold tracking-tight">Which language do you want to learn?</h1>
                                    <p className="text-muted-foreground">We'll find the best mentors for you.</p>
                                </div>
                                <Select value={formData.learning_language} onValueChange={(val) => updateForm("learning_language", val)}>
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Select language to learn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.filter(l => l !== formData.native_language).map(lang => (
                                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-bold tracking-tight">Set your hourly teaching rate</h1>
                                    <p className="text-muted-foreground">First 1 hour of chat is free for students.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        className="h-12 pl-8 text-lg"
                                        placeholder="0.00"
                                        value={formData.hourlyrate}
                                        onChange={(e) => updateForm("hourlyrate", e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <Button
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                            onClick={handleFinish}
                            disabled={formData.role === "student" ? !formData.learning_language : !formData.hourlyrate}
                        >
                            Finish Setup
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}

function RoleCard({ icon: Icon, title, desc, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:scale-[1.02]",
                selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
            )}
        >
            <div className={cn("p-3 rounded-full", selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            {selected && (
                <div className="absolute top-3 right-3 text-primary">
                    <Check className="h-5 w-5" />
                </div>
            )}
        </div>
    )
}
