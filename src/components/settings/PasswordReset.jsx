import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export function PasswordReset() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Password Reset</h2>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
            </div>

            <div className="max-w-xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Current Password</label>
                    <Input type="password" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">New Password</label>
                    <Input type="password" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Confirm New Password</label>
                    <Input type="password" />
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

                <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
            </div>
        </div>
    );
}
