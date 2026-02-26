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
import { Search, Star, MessageSquare, Filter, X, Globe } from "lucide-react";
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
import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns";

const user = [
    {
        id: 1,
        name: "Aisha Patel",
        native: { lang: "Japanese", flag: "🇯🇵" },
        known: ["English", "Spanish"],
        level: "Beginner Level",
        languages: "Malayalam, Hindi",
        learning: "English (Beginner)",
        goal: "Improve speaking confidence",
        bio: "Motivated learner aiming to improve English for career and daily communication. Interested in conversation...",
        rating: 4.9,
        reviews: 127,
        image: "https://i.pravatar.cc/150?u=aisha",
    },
    {
        id: 2,
        name: "Carlos Gomez",
        native: { lang: "Spanish", flag: "🇪🇸" },
        known: ["English", "Portuguese"],
        level: "Intermediate Level",
        languages: "Spanish",
        learning: "English (Intermediate)",
        goal: "Business English fluency",
        bio: "Looking for partners to practice business English. I can help you with Spanish grammar and vocabulary.",
        rating: 4.8,
        reviews: 93,
        image: "https://i.pravatar.cc/150?u=carlos",
    },
    {
        id: 3,
        name: "Sarah Kim",
        native: { lang: "Korean", flag: "🇰🇷" },
        known: ["English", "Japanese"],
        level: "Beginner Level",
        languages: "Korean",
        learning: "English (Beginner)",
        goal: "Travel preparation",
        bio: "Planning a trip to London next year. Want to learn basic phrases and cultural tips.",
        rating: 5.0,
        reviews: 42,
        image: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        id: 4,
        name: "David Chen",
        native: { lang: "Mandarin", flag: "🇨🇳" },
        known: ["English"],
        level: "Advanced Level",
        languages: "Mandarin",
        learning: "French (Beginner)",
        goal: "Learn a third language",
        bio: "Native Mandarin speaker looking for French exchange. Fluent in English and can help with that too.",
        rating: 4.7,
        reviews: 156,
        image: "https://i.pravatar.cc/150?u=david",
    },
    {
        id: 5,
        name: "Emily Wilson",
        native: { lang: "English", flag: "🇺🇸" },
        known: ["French"],
        level: "Intermediate Level",
        languages: "English",
        learning: "Spanish (Intermediate)",
        goal: "Connect with culture",
        bio: "Love Latin American culture and want to improve my Spanish speaking skills through casual conversation.",
        rating: 4.9,
        reviews: 88,
        image: "https://i.pravatar.cc/150?u=emily",
    },
    {
        id: 6,
        name: "Rahul Sharma",
        native: { lang: "Hindi", flag: "🇮🇳" },
        known: ["English", "Bengali"],
        level: "Beginner Level",
        languages: "Hindi, Bengali",
        learning: "German (Beginner)",
        goal: "Higher studies in Germany",
        bio: "Preparing for higher studies in Berlin. Need help with basic German and daily life vocabulary.",
        rating: 4.8,
        reviews: 67,
        image: "https://i.pravatar.cc/150?u=rahul",
    }
];
export function Directory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const currentuser = useSelector((state) => state.auth.user);
    const [bookingUser, setBookingUser] = useState(null);
    const [date, setDate] = useState(new Date("2025-06-29"));
    const [timeSlot, setTimeSlot] = useState("9.00 Am");
    const [timeOfDay, setTimeOfDay] = useState("morning");
    const navigate=useNavigate()

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const maxDate = addDays(tomorrow, 14);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const getTimeZoneAbbr = () => {
        try {
            return new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(part => part.type === 'timeZoneName')?.value || "Local";
        } catch (e) {
            return "Local";
        }
    }
    const tzAbbr = getTimeZoneAbbr();

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
                                    <div className="flex gap-2 w-1/2 mt-2">
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
                            <DialogContent className="max-w-4xl w-[95vw] p-0 flex flex-col overflow-hidden h-[90vh] md:h-auto md:max-h-[800px] bg-white rounded-2xl md:rounded-3xl border border-slate-200">
                                {bookingUser && (
                                    <>
                                        <DialogHeader className="p-4 md:p-6 border-b border-slate-100 flex flex-row items-center justify-between shrink-0 bg-white z-10 m-0">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 md:h-14 md:w-14 border border-slate-100 shadow-sm">
                                                    <AvatarImage src={bookingUser.prof_photo} />
                                                    <AvatarFallback>{bookingUser.first_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 md:space-y-1.5 flex flex-col items-start justify-center">
                                                    <DialogTitle className="text-lg md:text-xl font-bold leading-none">{bookingUser.first_name}</DialogTitle>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider">
                                                            {bookingUser.native_language}
                                                        </span>
                                                        {bookingUser.spoken_languages.map(lang => (
                                                            <span key={lang.id} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider">
                                                             {lang.spoken_language}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogClose className="h-8 w-8 mt-0! flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                                                <X className="h-5 w-5" />
                                            </DialogClose>
                                        </DialogHeader>

                                        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
                                            {/* Left side: Calendar */}
                                            <div className="p-4 md:p-6 border-b lg:border-b-0 lg:border-r flex flex-col items-center bg-white overflow-y-auto shrink-0 lg:w-80">
                                                <div className="w-full flex justify-between items-center mb-4">
                                                    <h3 className="text-sm md:text-base font-semibold text-slate-900">Select Date</h3>
                                                </div>
                                                <div className="w-full flex justify-center bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => d && setDate(d)}
                                                        className="w-full max-w-full"
                                                        disabled={(date) => isBefore(date, tomorrow) || isAfter(date, maxDate)}
                                                        fromDate={tomorrow}
                                                    />
                                                </div>
                                                <div className="mt-6 flex items-center gap-2 text-xs md:text-sm text-slate-500 bg-slate-50 px-3 py-2.5 rounded-lg w-full justify-center border border-slate-100">
                                                    <Globe className="h-4 w-4 shrink-0 text-blue-500" />
                                                    <span className="text-center truncate">Time displayed in <strong className="text-slate-700">{userTimezone} ({tzAbbr})</strong></span>
                                                </div>
                                            </div>

                                            {/* Right side: Timeslots & Summary */}
                                            <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden min-w-0">

                                                {/* Tabs Selection Area */}
                                                <div className="px-4 pt-4 md:px-6 md:pt-6 pb-2 shrink-0">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-sm md:text-base font-semibold text-slate-900">
                                                            Select a time slot
                                                        </h3>
                                                    </div>
                                                    <Tabs value={timeOfDay} onValueChange={setTimeOfDay} className="w-full">
                                                        <div className="bg-white rounded-xl p-1 border border-slate-200 shadow-sm flex mb-2">
                                                            <TabsList className="flex flex-1 w-full bg-transparent justify-around h-auto p-0 rounded-lg">
                                                                <TabsTrigger
                                                                    value="morning"
                                                                    className="flex-1 py-2.5 text-xs md:text-sm font-medium rounded-lg text-slate-500 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all border-none"
                                                                >
                                                                    Morning
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="afternoon"
                                                                    className="flex-1 py-2.5 text-xs md:text-sm font-medium rounded-lg text-slate-500 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all border-none"
                                                                >
                                                                    Afternoon
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="evening"
                                                                    className="flex-1 py-2.5 text-xs md:text-sm font-medium rounded-lg text-slate-500 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all border-none"
                                                                >
                                                                    Evening
                                                                </TabsTrigger>
                                                            </TabsList>
                                                        </div>

                                                        {/* Timeslot Content Area (Scrollable) */}
                                                        <div className="mt-2 md:mt-4 overflow-y-auto">
                                                            <TabsContent value="morning" className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 m-0">
                                                                {["8.00 Am", "9.00 Am", "10.00 Am", "11.00 Am", "12.00 Am"].map((time) => (
                                                                    <Button
                                                                        key={time}
                                                                        variant={timeSlot === time ? "default" : "outline"}
                                                                        className={`rounded-lg py-2 h-auto text-xs md:text-sm font-medium transition-all ${timeSlot === time
                                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600'
                                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                                                                            }`}
                                                                        onClick={() => setTimeSlot(time)}
                                                                    >
                                                                        {time}
                                                                    </Button>
                                                                ))}
                                                            </TabsContent>
                                                            <TabsContent value="afternoon" className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 m-0">
                                                                {["1.00 Pm", "2.00 Pm", "3.00 Pm", "4.00 Pm"].map((time) => (
                                                                    <Button
                                                                        key={time}
                                                                        variant={timeSlot === time ? "default" : "outline"}
                                                                        className={`rounded-lg py-2 h-auto text-xs md:text-sm font-medium transition-all ${timeSlot === time
                                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600'
                                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                                                                            }`}
                                                                        onClick={() => setTimeSlot(time)}
                                                                    >
                                                                        {time}
                                                                    </Button>
                                                                ))}
                                                            </TabsContent>
                                                            <TabsContent value="evening" className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 m-0">
                                                                {["5.00 Pm", "6.00 Pm", "7.00 Pm", "8.00 Pm"].map((time) => (
                                                                    <Button
                                                                        key={time}
                                                                        variant={timeSlot === time ? "default" : "outline"}
                                                                        className={`rounded-lg py-2 h-auto text-xs md:text-sm font-medium transition-all ${timeSlot === time
                                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600'
                                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                                                                            }`}
                                                                        onClick={() => setTimeSlot(time)}
                                                                    >
                                                                        {time}
                                                                    </Button>
                                                                ))}
                                                            </TabsContent>
                                                        </div>
                                                    </Tabs>
                                                </div>

                                                {/* Push to bottom spacer */}
                                                <div className="flex-1" />

                                                {/* Summary & Actions sticky footer */}
                                                <div className="bg-white border-t border-slate-200 shrink-0">
                                                    <div className="p-4 md:p-6 pb-4">
                                                        <h4 className="text-xs md:text-sm font-semibold text-slate-900 mb-3 block">
                                                            Booking Summary
                                                        </h4>

                                                        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 sm:mb-6">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-slate-500">Date</span>
                                                                <span className="text-sm font-semibold text-slate-800">{format(date, "MMM do, yyyy")}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-slate-500">Time</span>
                                                                <span className="text-sm font-semibold text-slate-800">{timeSlot}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-medium text-slate-500">Duration</span>
                                                                <span className="text-sm font-semibold text-slate-800">60m</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 text-right sm:text-left">
                                                                <span className="text-xs font-medium text-slate-500">Total Price</span>
                                                                <span className="text-sm font-bold text-slate-900">₹350</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                                                            <Button
                                                                variant="outline"
                                                                className="w-full sm:w-auto sm:flex-1 py-2.5 h-auto text-sm bg-white border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm rounded-xl font-medium"
                                                                onClick={() => setBookingUser(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                className="w-full sm:w-auto sm:flex-2 py-2.5 h-auto text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl font-medium"
                                                                onClick={() => {
                                                                    setBookingUser(null);
                                                                    navigate("/booking-success");
                                                                }}
                                                            >
                                                                Confirm & Pay
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
