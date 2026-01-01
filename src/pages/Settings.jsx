import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EditProfile } from "@/components/settings/EditProfile";
import { PasswordReset } from "@/components/settings/PasswordReset";
import { Wallet } from "@/components/settings/Wallet";
import { BookedMentors } from "@/components/settings/BookedMentors";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/utils/reduxstores/Authslice";
import AxiosInstance from "@/api/axiosInstance";

export function Settings() {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const dispatch=useDispatch()

    const handleTabChange = (value) => {
        if (value === "logout") {
            setShowLogout(true);
        } else {
            setActiveTab(value);
        }
    };

    const handleLogout = async() => {
        setShowLogout(false);
        try {
            await AxiosInstance.post("auth/logout/")
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            console.log(error)
            toast.error("Logout API failed", error);
        }

    };

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
        {/* Sidebar - hidden on mobile, visible on lg screens usually, but we'll make it responsive later or just sticky for now */}
        <Sidebar className="hidden lg:flex w-64 shrink-0" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col min-w-0">
            <Header />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account preferences and information
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none flex-wrap">
                        <TabTrigger value="profile">Edit Profile</TabTrigger>
                        <TabTrigger value="password">Password Reset</TabTrigger>
                        <TabTrigger value="wallet">Wallet</TabTrigger>
                        <TabTrigger value="mentors">Booked Mentors</TabTrigger>
                        <TabTrigger value="logout" className="text-red-500 hover:text-red-600 data-[state=active]:text-red-600 data-[state=active]:border-red-600">Logout</TabTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="min-h-[400px]">
                        <div className="border rounded-xl p-6 bg-card shadow-sm">
                            <EditProfile />
                        </div>
                    </TabsContent>
                    <TabsContent value="password" className="min-h-[400px]">
                        <div className="border rounded-xl p-6 bg-card shadow-sm">
                            <PasswordReset />
                        </div>
                    </TabsContent>
                    <TabsContent value="wallet" className="min-h-[400px]">
                        <Wallet />
                    </TabsContent>
                    <TabsContent value="mentors" className="min-h-[400px]">
                        <div className="border rounded-xl p-6 bg-card shadow-sm">
                            <BookedMentors />
                        </div>
                    </TabsContent>
                </Tabs>

                <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will need to sign in again to access your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            </main>
        </div>
        </div>
        
    );
}

function TabTrigger({ value, children, className }) {
    return (
        <TabsTrigger
            value={value}
            className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-medium ${className}`}
        >
            {children}
        </TabsTrigger>
    )
}
