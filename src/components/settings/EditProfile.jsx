import React, { use, useEffect,useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Unused import removed
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AxiosInstance from "@/api/axiosInstance";

export function EditProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await AxiosInstance.get("/auth/currentuser");
                console.log(response.data)
                setUser(response.data); 
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
            };

            fetchUser();
        }, []);

    if (!user) return <div>Loading...</div>;
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details and public profile</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" /> Change Photo
                    </Button>
                </div>

                <div className="flex-1 space-y-6 w-full max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">First Name</label>
                            <Input value={user.first_name} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Last Name</label>
                            <Input value={user.last_name} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email Address</label>
                        <Input value={user.email} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Bio</label>
                        <Textarea
                            className="min-h-[100px]"
                            value={user.bio}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Native Language</label>
                            <Select defaultValue={user?.native_language}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                    <SelectItem value="French">French</SelectItem>
                                    <SelectItem value="German">German</SelectItem>
                                    <SelectItem value="Italian">Italian</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="Russian">Russian</SelectItem>
                                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                                    <SelectItem value="Korean">Korean</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Known Languages</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {user.spoken_languages.map((lang) => (
                                    <span
                                    key={lang.id}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                                    >
                                    {lang.spoken_language} <span className="cursor-pointer">×</span>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Italian">Italian</SelectItem>
                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                        <SelectItem value="Russian">Russian</SelectItem>
                                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        <SelectItem value="Korean">Korean</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">Add</Button>
                            </div>
                        </div>
                    </div>
                    {/* Role Specific Fields */}
                    {user.role === "student" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Learning Language</label>
                                <Select defaultValue="spanish">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spanish">Spanish</SelectItem>
                                        <SelectItem value="french">French</SelectItem>
                                        <SelectItem value="german">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Proficiency Level</label>
                                <Select defaultValue="beginner">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {user.role === "mentor" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Hourly Rate ($)</label>
                                <Input type="number" placeholder="0.00" defaultValue="25.00" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
