import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {useState, useEffect } from "react";

export function UserDetailsModal({ user, open, onOpenChange }) {

    if (!user) return <div>Loading...</div>;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-8">
                    {/* Header Info */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                            <AvatarImage src={user.prof_photo} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-500">{user.email}</p>
                            <Badge variant="secondary" className="mt-2 text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-100">
                                {user.role}
                            </Badge>
                        </div>
                    </div>

                    {/* Languages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Native Language</label>
                                <p className="font-medium text-slate-900">{user.native_language || "English"}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning Language</label>
                                <p className="font-medium text-slate-900">{user.learning_language || "French"}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Speaking Languages</label>
                                <p className="font-medium text-slate-900">
                                    {Array.isArray(user.spoken_languages)
                                    ? user.spoken_languages.map(l => l.spoken_language).join(", ")
                                    : user.spoken_languages?.spoken_language || "English"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bio</label>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {user.bio || "Passionate about learning languages and connecting with people from different cultures..."}
                        </p>
                    </div>

                    {/* Premium Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Status</label>
                            <p className={cn("font-medium", user.premium ? "text-emerald-600" : "text-slate-500")}>
                                {user.premium ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Start</label>
                            <p className="font-medium text-slate-900">2024-01-15</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium End</label>
                            <p className="font-medium text-slate-900">2025-01-15</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trial Used</label>
                            <p className="font-medium text-slate-900">Yes</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button variant="outline">Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
