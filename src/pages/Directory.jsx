import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MessageSquare, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AxiosInstance from "@/api/axiosInstance";
import { useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Navigate, useNavigate } from "react-router-dom";


export function Directory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const currentuser = useSelector((state) => state.auth.user);
    const navigate=useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await AxiosInstance.get("/admin/users");
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, []);

    const handlechat=async(id)=>{
        try{
            const response=await AxiosInstance.post(`chat/get-or-createchatroom/${id}/`)
            const roomName=response.data.chat_room.group_name
            navigate(`/chats/${roomName}`)
        }catch(error){
            console.log(error)
        }
    }

    // 1. Determine which users to show based on role
    // Using useMemo prevents unnecessary calculations on every keystroke
    const filteredUsers = useMemo(() => {
        if (!currentuser) return [];

        // Filter by role first
        const pool = users.filter(u => 
            currentuser.role === "student" ? u.role === "mentor" : u.role === "student"
        );

        // Then filter by search query
        return pool.filter(user => {
            const query = searchQuery.toLowerCase();
            // Note: Added optional chaining (?.) and fallbacks to prevent crashes
            return (
                user.first_name?.toLowerCase().includes(query) ||
                user.learning_language?.toLowerCase().includes(query) ||
                user.native_language?.toLowerCase().includes(query)
            );
        });
    }, [users, searchQuery, currentuser]);

    // 2. Dynamic Title
    const title = currentuser?.role === "mentor" ? "Students" : "Mentors";

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
              {/* Sidebar - hidden on mobile, visible on lg screens usually, but we'll make it responsive later or just sticky for now */}
              <Sidebar className="hidden lg:flex w-64 shrink-0" />
        
              {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0">
                <Header />
        
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">sort by :</span>
                                    <Select defaultValue="alphabet">
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="alphabet">Alphabet</SelectItem>
                                            <SelectItem value="rating">Rating</SelectItem>
                                            <SelectItem value="recent">Recently Active</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search mentors" // Keeping "Search mentors" to match screenshot exact text, though logic implies students
                                        className="pl-9 bg-slate-50 border-slate-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="bg-slate-100 border-none hover:bg-slate-200 text-slate-700">All Languages</Button>
                                    <Button variant="outline" className="bg-slate-100 border-none hover:bg-slate-200 text-slate-700">Any Rating</Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                                    <div className="flex gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={user.prof_photo} className="object-cover" />
                                            <AvatarFallback>{user.first_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg">{user.first_name}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                                    🏁 Native: {user.native_language}
                                                </span>
                                                {user.spoken_languages.map(lang => (
                                                    <span key={lang.id} className="border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                                                        {lang.spoken_language}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm pt-1">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-4 w-4 ${star <= Math.floor(user.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-slate-700"></span>
                                                <span className="text-slate-500">()</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-blue-600 font-medium text-sm">{user.bio}</h4>
                                        </div>

                                        <div className="space-y-1 text-sm text-slate-600">
                                            <p><span className="text-slate-500">Languages:
                                                {user.spoken_languages.map(lang => (
                                                    <span key={lang.id} className="border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                                                        {lang.spoken_language}
                                                    </span>
                                                ))}</span> </p>
                                            {user.role=="student"?(<p><span className="text-slate-500">Learning:{user.learning_language}</span> </p>):
                                            (<p><span className="text-slate-500">HourlyRate:{user.hourlyrate}</span> </p>)}
                                           
                                        </div>

                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                            <span className="text-slate-500">bio:{user.bio}</span>
                                            
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button className="flex-1 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium" onClick={()=>handlechat(user.id)}>
                                            chat
                                        </Button>
                                        <Button className="flex-1 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium" >
                                            Book
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* <div className="flex justify-center pt-8">
                            <Button variant="outline" size="lg" className="min-w-[200px] border-blue-200 text-slate-700 hover:bg-blue-50">
                                Load More
                            </Button>
                        </div> */}
                    </div>
                </main>
            </div>
        </div>
    );
}
