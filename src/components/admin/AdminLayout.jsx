import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AxiosInstance from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from "@/utils/reduxstores/Authslice";

export function AdminLayout() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleLogout = async() => {
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
        <div className="flex min-h-screen bg-slate-50/50 font-sans antialiased text-slate-900">
            <AdminSidebar className="hidden lg:flex w-72 shrink-0 shadow-sm z-10" />
            <div className="flex flex-1 flex-col min-w-0">
                {/* Admin Header */}
                <header className="sticky top-0 z-20 w-full bg-white border-b px-8 h-20 flex items-center justify-between">
                    <div>
                        {/* Breadcrumbs or Page Title placeholder - dynamic in real app */}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-sm">
                                <p className="font-semibold text-slate-800">Admin User</p>
                                <p className="text-slate-500 text-xs">Administrator</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 hidden md:flex border-slate-200" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
