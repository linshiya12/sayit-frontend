import React, { useState,useEffect } from "react";
import { Search, Trash2, Phone, Video, ArrowDownLeft, ArrowUpRight, X, Users,PhoneIncoming ,PhoneOutgoing} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate,useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

// Mock Calls Data remains same
const MOCK_CHATS = [
    {
        id: 1,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/300?u=hiroshi",
        status: "online",
        lastMessage: "Let's practice your pronunciation...",
        time: "10:42 Am",
        unread: 2
    },
    {
        id: 2,
        name: "Sarah Miller",
        avatar: "https://i.pravatar.cc/300?u=sarah",
        status: "offline",
        lastMessage: "Thanks for the lesson!",
        time: "Yesterday",
        unread: 0
    },
    {
        id: 3,
        name: "David Chen",
        avatar: "https://i.pravatar.cc/300?u=david",
        status: "online",
        lastMessage: "When is our next class?",
        time: "Yesterday",
        unread: 0
    }
];

const CALL_HISTORY = [
    {
        id: 1,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/300?u=hiroshi",
        status: "missed",
        type: "incoming",
        time: "10:40 AM",
        date: "Today"
    },
    {
        id: 2,
        name: "James Wilson",
        avatar: "https://i.pravatar.cc/300?u=james",
        status: "scheduled",
        type: "outgoing",
        time: "10:40 AM",
        date: "Today"
    },
    {
        id: 3,
        name: "Sophia Chen",
        avatar: "https://i.pravatar.cc/300?u=sophie",
        status: "completed",
        type: "incoming",
        time: "10:40 AM",
        date: "Today"
    },
    {
        id: 4,
        name: "David Miller",
        avatar: "https://i.pravatar.cc/300?u=david",
        status: "missed",
        type: "incoming",
        time: "10:40 AM",
        date: "Today"
    }
];


export function ChatSidebar({ chats, selectedChatId, onSelectChat, onDeleteChat, allMessages,className }) {
    // 1. Get current user from Redux to filter out ourselves from the member list
    const currentuser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine default tab based on URL
    const getInitialTab = () => {
        if (location.pathname.includes('/calls')) return 'calls';
        if (location.pathname.includes('/communities')) return 'communities';
        return 'chats';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [callFilter, setCallFilter] = useState("all");

    // Sync tab with URL if it changes externally
    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [location.pathname]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        if (value === 'chats') navigate('/chats');
        if (value === 'calls') navigate('/calls');
        // if (value === 'communities') navigate('/communities');
    };

    // Filter Logic for Calls
    const filteredCalls = CALL_HISTORY.filter(call => {
        if (callFilter === "all") return true;
        if (callFilter === "missed") return call.status === "missed";
        if (callFilter === "completed") return call.status === "completed";
        if (callFilter === "upcoming") return call.status === "scheduled";
        return true;
    });


    // Get role dynamically from Redux if available
    const userRole = currentuser?.role || "student";

    const handleActionClick = () => {
        if (userRole === "student") {
            navigate("/mentors");
        } else {
            navigate("/admin/users");
        }
    };
    console.log("nffjdf",chats)
    return (
        <div className={cn("flex flex-col h-full bg-white border-r", className)}>
            {/* Search Header */}
            <div className="p-4 border-b border-slate-50 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={`Search ${userRole === 'student' ? 'mentors' : 'students'}...`}
                        className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    />
                </div>

                <div
                    onClick={handleActionClick}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1 transition-colors"
                >
                    {userRole === "student" ? "Search mentors here →" : "View students here →"}
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 flex flex-col min-h-0">
                <TabsList className="w-full justify-start rounded-none border-b h-12 bg-transparent p-0 flex-shrink-0">
                    <TabsTrigger value="chats" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none bg-transparent">
                        Chats
                    </TabsTrigger>
                    <TabsTrigger value="calls" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none bg-transparent">
                        Calls
                    </TabsTrigger>
                    <TabsTrigger value="communities" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none bg-transparent">
                        Communities
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chats" className="flex-1 overflow-y-auto m-0">
                    <div className="divide-y divide-slate-50">
                        {chats && chats.length > 0 ? (
                            chats.map((chat) => {
                                // 2. LOGIC: Find the other person in the chat
                                const otherMember = chat.members?.find(
                                    (m) => Number(m.id) !== Number(currentuser?.id)
                                );

                                // Use first_name or username as fallback
                                const displayName = otherMember?.first_name || otherMember?.username || "Chat User";

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => onSelectChat(chat)}
                                        className={cn(
                                            "flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative",
                                            selectedChatId === chat.id ? "bg-slate-50" : ""
                                        )}
                                    >
                                        {/* Avatar section */}
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-slate-100">
                                                {/* Replace with otherMember.avatar if your backend sends it */}
                                                <AvatarImage src={otherMember?.prof_photo} alt={displayName} />
                                                <AvatarFallback>{displayName[0]}</AvatarFallback>
                                            </Avatar>
                                            {/* Status Dot */}
                                            {otherMember?.is_online && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-slate-50"></span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-semibold text-sm text-slate-900 truncate pr-2">
                                                    {displayName}
                                                </h3>
                                                <span className={cn("text-[10px] whitespace-nowrap", chat.unread > 0 ? "text-green-600 font-bold" : "text-slate-400")}>
                                                    {chat.time || "Just now"}
                                                </span>
                                            </div>
                                            
                                            <p className={cn("text-xs truncate", chat.unread > 0 ? "text-slate-900 font-medium" : "text-slate-500")}>
                                                {"fnfj" || "No messages yet"}
                                            </p>

                                            {/* Optional Badge for active sessions */}
                                            {chat.is_active && (
                                                <div className="mt-1.5 flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="h-5 px-1.5 bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px]">
                                                        Active Session
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete Action Wrapper */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteChat(chat.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No conversations yet.
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Calls and Communities Content remains unchanged */}

                <TabsContent value="calls" className="flex-1 flex flex-col m-0 overflow-hidden">
                    {/* Sub-Tabs for Calls */}
                    <div className="px-2 pt-2 pb-0">
                        <Tabs defaultValue="all" value={callFilter} onValueChange={setCallFilter} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1 h-auto">
                                <TabsTrigger value="all" className="text-[10px] py-1.5 h-auto">All</TabsTrigger>
                                <TabsTrigger value="missed" className="text-[10px] py-1.5 h-auto">Missed</TabsTrigger>
                                <TabsTrigger value="upcoming" className="text-[10px] py-1.5 h-auto">Upcoming</TabsTrigger>
                                <TabsTrigger value="completed" className="text-[10px] py-1.5 h-auto">Done</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredCalls.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs">
                                No calls found.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredCalls.map((call) => (
                                    <div key={call.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 md:h-12 md:w-12 border">
                                                <AvatarImage src={call.avatar} />
                                                <AvatarFallback>{call.name[0]}</AvatarFallback>
                                            </Avatar>

                                            {/* Status Dot */}
                                            {call.status === 'missed' && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
                                            )}
                                            {call.status === 'scheduled' && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
                                            )}
                                            {call.status === 'completed' && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h3 className="font-semibold text-sm truncate">{call.name}</h3>
                                                <span className={cn(
                                                    "text-[10px] font-medium",
                                                    call.status === 'missed' ? "text-red-500" :
                                                        call.status === 'scheduled' ? "text-blue-500" :
                                                            call.status === 'completed' ? "text-green-600" : "text-slate-500"
                                                )}>
                                                    {call.status === 'missed' ? 'Missed' :
                                                        call.status === 'scheduled' ? 'Scheduled' :
                                                            call.status === 'completed' ? 'Done' : ''}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    {call.type === 'incoming' ? <PhoneIncoming className="h-3 w-3" /> : <PhoneOutgoing className="h-3 w-3" />}
                                                    {call.date}, {call.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="communities" className="flex-1 overflow-y-auto m-0">
                    <div className="p-8 text-center text-slate-400">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-600 mb-1">No Communities Yet</h3>
                        <p className="text-xs max-w-[200px] mx-auto">Join a community to connect with other learners and mentors.</p>
                        <Button variant="outline" size="sm" className="mt-4 text-xs">Explore Communities</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}