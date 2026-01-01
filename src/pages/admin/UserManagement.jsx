import React, { useState,useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { cn } from "@/lib/utils";
import AxiosInstance from "@/api/axiosInstance";



export function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await AxiosInstance.get("/admin/users");
                console.log(response.data)
                setUsers(response.data); 
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
            };

            fetchUser();
        }, []);


    const handleView = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleBlock = async (userId, isBlocked) => {
        try {
            // Call backend API to update is_blocked
            await AxiosInstance.put(`admin/block-user/${userId}/`, { is_blocked: !isBlocked });

            // Update local state
            setUsers(users.map(user => {
            if (user.id === userId) {
                return { ...user, is_blocked: !isBlocked }; // toggle the value
            }
            return user;
            }));
        } catch (err) {
            console.error("Failed to update user block status", err);
        }
    };



    const students = users.filter(u => u.role === "student");
    const mentors = users.filter(u => u.role === "mentor");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                <p className="text-slate-500">Manage users, students, and mentors</p>
            </div>

            <div className="space-y-8">
                {/* Students Section */}
                <UserSection
                    title="Students"
                    users={students}
                    onView={handleView}
                    onBlock={handleBlock}
                />

                {/* Mentors Section */}
                <UserSection
                    title="Mentors"
                    users={mentors}
                    onView={handleView}
                    onBlock={handleBlock}
                />
            </div>

            <UserDetailsModal
                user={selectedUser}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </div>
    );
}

function UserSection({ title, users, onView, onBlock }) {
    if (users.length === 0) return null;

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">User ID</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Languages</th>
                                <th className="px-6 py-4 font-medium">Premium</th>
                                <th className="px-6 py-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.prof_photo} />
                                                <AvatarFallback>{user.initials}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-slate-900">{user.first_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.native_language}</td>
                                    <td className="px-6 py-4">
                                        {user.premium ? (
                                            <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-800 font-normal">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-400 border-slate-200 font-normal">Inactive</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs font-medium border-slate-200 hover:bg-slate-50"
                                                onClick={() => onView(user)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "h-8 text-xs font-medium w-16",
                                                    user.is_blocked
                                                        ? "bg-slate-200 text-slate-500 hover:bg-slate-300" // Unblock style
                                                        : "bg-red-500 hover:bg-red-600 text-white" // Block style
                                                )}
                                                 onClick={() => onBlock(user.id, user.is_blocked)}
                                            >
                                                {user.is_blocked? "Unblock" : "Block"}
                                            </Button>
                                        </div>
                                        {user.is_blocked  && (
                                            <div className="text-center mt-1">
                                                <Badge variant="destructive" className="h-4 text-[10px] px-1 py-0">Blocked</Badge>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
