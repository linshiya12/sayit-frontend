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
import { Search, Star, MessageSquare, Filter, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AxiosInstance from "@/api/axiosInstance";
import { useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";


export function Directory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const currentuser = useSelector((state) => state.auth.user);
    const [bookingUser, setBookingUser] = useState(null);
    const [date, setDate] = useState(new Date("2025-06-29"));
    const [timeSlot, setTimeSlot] = useState("9.00 Am");
    const [timeOfDay, setTimeOfDay] = useState("morning");
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
            const data={"id":id,"category":"chat"}
            const response=await AxiosInstance.post(`chat/get-or-createchatroom/`,data)
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
                                    <div className="flex gap-2 w-full mt-2">
                                        <Button variant="outline" className="w-full text-blue-500 border-blue-200 hover:bg-blue-50 bg-white shadow-none" onClick={()=>handlechat(user.id)}>
                                            chat
                                        </Button>
                                        <Button
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                                            onClick={() => setBookingUser(user)}
                                        >
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

                        {/* Booking Modal */}
                        <Dialog open={!!bookingUser} onOpenChange={(open) => !open && setBookingUser(null)}>
                            <DialogContent className="sm:max-w-[425px] p-0 rounded-2xl overflow-hidden gap-0 bg-white">
                                {bookingUser && (
                                    <>
                                        <DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-start justify-between m-0">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12 border border-slate-100 shadow-sm">
                                                    <AvatarImage src={bookingUser.image} />
                                                    <AvatarFallback>{bookingUser.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <DialogTitle className="text-lg font-bold leading-none">{bookingUser.name}</DialogTitle>
                                                    <div className="flex items-center gap-1">
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider">
                                                            {bookingUser.native.lang}
                                                        </span>
                                                        {bookingUser.known.slice(0, 1).map(lang => (
                                                            <span key={lang} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider">
                                                                {lang}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogClose className="h-8 w-8 !mt-0 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 absolute right-4 top-4">
                                                <X className="h-4 w-4" />
                                            </DialogClose>
                                        </DialogHeader>

                                        <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800 mb-3">Select Date</h3>
                                                <div className="flex justify-center">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => d && setDate(d)}
                                                        className="rounded-md border-0 p-0"
                                                        classNames={{
                                                            day_selected: "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white rounded-full",
                                                            day_today: "bg-slate-100 text-slate-900 rounded-full",
                                                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-full flex items-center justify-center",
                                                            head_cell: "text-slate-500 font-medium w-9 font-normal text-[0.8rem]",
                                                            caption: "flex justify-between pt-1 relative items-center mb-4",
                                                            caption_label: "text-sm font-medium",
                                                            nav: "space-x-1 flex items-center",
                                                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-0 flex justify-center items-center shadow-none",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800 mb-3">Available Time Slots</h3>
                                                <Tabs value={timeOfDay} onValueChange={setTimeOfDay} className="w-full">
                                                    <TabsList className="w-full bg-transparent border-b border-slate-200 rounded-none h-auto p-0 justify-between">
                                                        <TabsTrigger
                                                            value="morning"
                                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent shadow-none w-1/3 py-2 text-sm text-slate-500"
                                                        >
                                                            Morning
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="afternoon"
                                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent shadow-none w-1/3 py-2 text-sm text-slate-500"
                                                        >
                                                            Afternoon
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="evening"
                                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent shadow-none w-1/3 py-2 text-sm text-slate-500"
                                                        >
                                                            Evening
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="morning" className="grid grid-cols-2 gap-3 mt-4">
                                                        {["8.00 Am", "9.00 Am", "10.00 Am", "11.00 Am", "12.00 Am"].map((time, idx) => (
                                                            <Button
                                                                key={time}
                                                                variant={timeSlot === time ? "default" : "outline"}
                                                                className={`rounded-full shadow-none ${timeSlot === time
                                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                                                                        : idx === 2
                                                                            ? 'bg-slate-100 text-slate-400 border-none hover:bg-slate-100 cursor-not-allowed'
                                                                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                                                                    }`}
                                                                onClick={() => idx !== 2 && setTimeSlot(time)}
                                                                disabled={idx === 2}
                                                            >
                                                                {time}
                                                            </Button>
                                                        ))}
                                                    </TabsContent>
                                                    <TabsContent value="afternoon" className="grid grid-cols-2 gap-3 mt-4">
                                                        {["1.00 Pm", "2.00 Pm", "3.00 Pm", "4.00 Pm"].map((time, idx) => (
                                                            <Button
                                                                key={time}
                                                                variant={timeSlot === time ? "default" : "outline"}
                                                                className={`rounded-full shadow-none ${timeSlot === time ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                                                                onClick={() => setTimeSlot(time)}
                                                            >
                                                                {time}
                                                            </Button>
                                                        ))}
                                                    </TabsContent>
                                                    <TabsContent value="evening" className="grid grid-cols-2 gap-3 mt-4">
                                                        {["5.00 Pm", "6.00 Pm", "7.00 Pm", "8.00 Pm"].map((time, idx) => (
                                                            <Button
                                                                key={time}
                                                                variant={timeSlot === time ? "default" : "outline"}
                                                                className={`rounded-full shadow-none ${timeSlot === time ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                                                                onClick={() => setTimeSlot(time)}
                                                            >
                                                                {time}
                                                            </Button>
                                                        ))}
                                                    </TabsContent>
                                                </Tabs>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800 mb-2">Booking Summary</h3>
                                                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500 font-medium">Date</span>
                                                        <span className="font-semibold text-slate-800">{format(date, "MMMM do, yyyy").toLowerCase()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500 font-medium">Time</span>
                                                        <span className="font-semibold text-slate-800">{timeSlot}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500 font-medium">Duration</span>
                                                        <span className="font-semibold text-slate-800">60 minutes</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                                                        <span className="text-slate-500 font-medium">Price</span>
                                                        <span className="font-bold text-slate-900">₹350/hr</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 pt-2 border-t border-slate-100 flex gap-3 bg-white">
                                            <Button
                                                variant="outline"
                                                className="flex-1 rounded-full border-slate-200 shadow-none text-slate-600 hover:bg-slate-50 font-medium"
                                                onClick={() => setBookingUser(null)}
                                            >
                                                cancel
                                            </Button>
                                            <Button
                                                className="flex-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-none font-medium"
                                                onClick={() => {
                                                    setBookingUser(null);
                                                    navigate("/booking-success");
                                                }}
                                            >
                                                Pay & Book
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>

                    </div>
                </main>
            </div>
        </div>
    );
}
