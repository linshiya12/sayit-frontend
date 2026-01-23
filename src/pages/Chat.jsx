import React, { useEffect, useRef, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import AxiosInstance from "@/api/axiosInstance";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import UniversalShimmer from "@/components/ui/UniversalShimmer";

export function Chat() {
    const [chats, setChats] = useState([]);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [selectedChat, setSelectedChat] = useState(null);
    const { roomName } = useParams();
    const statusSocketRef = useRef(null); 
    const chatSocketRef = useRef(null);
    const token=useSelector((state)=>state.auth.accessToken)


    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await AxiosInstance.get("chat/list-chatroom/");
                setChats(response.data.chat_room);
            } catch (error) {
                console.log("Error fetching sidebar chats:", error);
            }
        };

        fetchChats();
    }, []);
    console.log("chatttt",chats)
    console.log(selectedChat)

    useEffect(() => {
        if (chats && roomName) {
            const current = chats.find(c => c.group_name === roomName);
            setSelectedChat(current);
        }
    }, [roomName, chats]);

    useEffect(() => {
        if (!selectedChat?.id) return;
        // OPTIONAL: Only fetch if we don't have messages for this chat yet
        if (!messagesByChat[selectedChat.id]) {
            const fetchChatMessages = async () => {
                try {
                    const room_name = selectedChat.group_name;
                    const response = await AxiosInstance.get(`chat/get-chat/${room_name}/`);
                    
                    setMessagesByChat((prev) => ({
                        ...prev,
                        [selectedChat.id]: response.data.messages
                    }));
                } catch (error) {
                    console.error("Fetch failed", error);
                }
            };
            fetchChatMessages();
        }
    }, [selectedChat?.id]);

    console.log("srr",messagesByChat)

useEffect(() => {
    if (!token) return;

    // 1. CHECK FIRST: If we already have an active connection, don't do anything
    if (statusSocketRef.current && 
       (statusSocketRef.current.readyState === WebSocket.CONNECTING || 
        statusSocketRef.current.readyState === WebSocket.OPEN)) {
        return; 
    }

    // 2. NOW CREATE: Only if the check above didn't return
    const url = `ws://localhost:8000/ws/online/?token=${token}`;
    const socket = new WebSocket(url);
    statusSocketRef.current = socket;

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.user_id) {
            setChats((prev) => 
                prev.map(chat => ({
                    ...chat,
                    members: chat.members?.map(member => 
                        Number(member.id) === Number(data.user_id)
                            ? { ...member, is_online: data.is_online, last_seen: data.last_seen }
                            : member
                    )
                }))
            );
        }
    };

    return () => {
        // 3. CLEANUP: This runs when the component unmounts
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close();
            statusSocketRef.current = null; // Important: Clear the ref on close
        }
    };
}, [token]);

console.log("chatafteronline",chats)

useEffect(() => {
    if (!selectedChat?.group_name || !token) return;

    const url = `ws://localhost:8000/ws/chat/${selectedChat.group_name}/?token=${token}`;
    const socket = new WebSocket(url);
    chatSocketRef.current = socket;

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const currentChatId = selectedChat.id;

        setMessagesByChat((prev) => {
                // Get the old messages for this specific chat
            const existingMessages = prev[currentChatId] || [];
                
            return {
                ...prev,
                [currentChatId]: [...existingMessages, data.messages]
            };
        });
    };

    socket.onclose = () => console.log("Chat Socket Closed");
    return () => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close();
        }
        chatSocketRef.current = null;
    };
}, [selectedChat?.group_name, token, selectedChat?.id]);
    const handleDeleteChat = (chatId) => {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            setChats(chats.filter(c => c.id !== chatId));
            if (selectedChat?.id === chatId) {
                setSelectedChat(null);
            }
        }
    };

    const handleSendMessage = (new_message) => {
        if (!selectedChat) return;
        if (chatSocketRef.current.readyState === WebSocket.OPEN) {
        chatSocketRef.current.send(JSON.stringify({
            message: new_message
        }));
        }
    }
    // const handleSendMessage = (text) => {
    //     if (!selectedChat) return;

    //     const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //     const newMessage = {
    //         id: Date.now(),
    //         text,
    //         originalText: text,
    //         translation: "Simulated translation: " + text,
    //         senderId: 'me',
    //         time: timestamp,
    //         date: "Today"
    //     };

    //     setMessagesByChat(prev => ({
    //         ...prev,
    //         [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    //     }));

    //     // Mock Auto-Reply
    //     setTimeout(() => {
    //         const replyMsg = {
    //             id: Date.now() + 1,
    //             text: "That's interesting! Tell me more.",
    //             translation: "¡Eso es interesante! Cuéntame más.",
    //             senderId: selectedChat.id,
    //             senderAvatar: selectedChat.avatar,
    //             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //             date: "Today"
    //         };
    //         setMessagesByChat(prev => ({
    //             ...prev,
    //             [selectedChat.id]: [...(prev[selectedChat.id] || []), replyMsg]
    //         }));
    //     }, 2000);
    // };

    
    const handleDeleteMessage = (messageId) => {
        if (!selectedChat) return;

        setMessagesByChat(prev => ({
            ...prev,
            [selectedChat.id]: prev[selectedChat.id].filter(m => m.id !== messageId)
        }));
    };

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            <Sidebar className="hidden lg:flex w-64 shrink-0" />
            <div className="flex flex-1 flex-col min-w-0 h-screen">
                <Header />
                <main className="flex-1 overflow-hidden bg-slate-50 relative">
                    <div className="h-full w-full bg-white flex relative">
                        {/* Sidebar - Hidden on mobile if chat is selected */}
                        <div className={cn(
                            "w-full md:w-80 lg:w-96 flex-shrink-0 border-r bg-white absolute md:relative z-10 h-full transition-transform duration-300",
                            selectedChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
                        )}>
                            <ChatSidebar
                                chats={chats}
                                selectedChatId={selectedChat?.id}
                                onSelectChat={setSelectedChat}
                                onDeleteChat={handleDeleteChat}
                            />
                        </div>

                        {/* Chat Window - Absolute on mobile to slide in */}
                        <div className={cn(
                            "flex-1 bg-slate-50 h-full absolute md:relative w-full transition-transform duration-300 z-20 md:z-auto",
                            selectedChat ? "translate-x-0" : "translate-x-full md:translate-x-0"
                        )}>
                            <ChatWindow
                                key={selectedChat?.id} // Force re-render when chat changes
                                chat={selectedChat}
                                messages={messagesByChat[selectedChat?.id] || []}
                                onSendMessage={handleSendMessage}
                                onDeleteMessage={handleDeleteMessage}
                                onBack={() => setSelectedChat(null)}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
