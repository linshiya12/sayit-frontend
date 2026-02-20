import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleModal } from "@/components/profile/ScheduleModal";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { cn } from "@/lib/utils";
import {
    Calendar as CalendarIcon,
    MoreVertical,
    Search,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Users,
    Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const UPCOMING_SESSIONS = [
];

export function Calls() {
    const location = useLocation();
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [callStatus, setCallStatus] = useState(location.state?.autoJoin ? "joined" : "idle");
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [room, setRoom] = useState(location.state?.room_name || null);
    const [peer,setPeer] = useState(null)
    const [isRemoteConnected, setIsRemoteConnected] = useState(false);
    
    const token = useSelector((state) => state.auth.accessToken);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const wsRef=useRef(null)
    const pcRef=useRef(null)
    const remoteVideoRef=useRef(null)
    const isMentor = false; 
    const me=useSelector((state)=>state.auth.user.id)



    // useEffect(() => {
    //     if (callStatus!="joined") return;
    //     let stream = null;
    //     const startCamera = async () => {
    //         try {
    //             stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //             localStreamRef.current=stream
    //             if (localVideoRef.current) {
    //                 localVideoRef.current.srcObject = stream;
    //             }
    //         } catch (err) {
    //             console.error("Error accessing camera:", err);
    //         }
            
    //     };
    //     startCamera();
    //     return () => {
    //         if (stream) {
    //             stream.getTracks().forEach(track => track.stop());
    //         }
    //     };
    // }, [callStatus]);

    const iceServers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    };

    const createPeerConnection=()=>{
        const pc=new RTCPeerConnection(iceServers)
        console.log(pc)
        // Send ICE to backend
        pc.onicecandidate = (event) => {
            console.log(event,"🕐🌟⭐")
            if (event.candidate) {
                wsRef.current.send(JSON.stringify({
                    type: "ice",
                    candidate: event.candidate
                }));
            }
        };

        // Receive remote stream
        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
            setIsRemoteConnected(true)
        };
        console.log("lll",localStreamRef)

        // Add local tracks
        localStreamRef.current.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });

        pcRef.current = pc;
        return pc;
    }

    
    const handleStartCall = () => {
        if (!token || !room) return;
        setCallStatus("joined");
    };

    useEffect(() => {
        if (callStatus !== "joined" || !token || !room) return;
        const startCall=async()=>{
            console.log("hi")
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current=stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                console.log("camera ready")

                if (callStatus !== "joined" || !token || !room ) return;
                console.log("hi",callStatus)
                const url = `ws://localhost:8000/ws/video/${room}/?token=${token}`;
                const ws = new WebSocket(url);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("✅ WebSocket connected");
                    setCallStatus("joined");
                };

                ws.onmessage = async (event) => {
                    const data = JSON.parse(event.data);
                    console.log("📩 WS message:", data)
                    const type=data.type
                    switch(type){
                        case "new_peer":
                            const otherUserId = data.user;
                            console.log("name", data.peername)
                            console.log("👤 New peer joined:", otherUserId);
                            // 1️⃣ Ignore if message about myself
                            setPeer(data.peername)
                            if (otherUserId === me) {
                                console.log("Ignoring myself");
                                break;
                            }
                            // 2️⃣ Decide who creates offer
                            if (me < otherUserId) {
                                console.log("🚀 I will create OFFER");
                                if (!pcRef.current) {
                                    pcRef.current = createPeerConnection();
                                }
                                const offer = await pcRef.current.createOffer();
                                await pcRef.current.setLocalDescription(offer);
                                console.log("🎥 OFFER CREATED:");
                                console.log(offer);
                                wsRef.current.send(JSON.stringify({
                                    type: "offer",
                                    offer: offer,
                                    to: otherUserId
                                }));
                            }else {
                                console.log("⏳ Waiting for offer...");
                            }
                            break;
                        case "offer":
                            const senderId = data.from;
                            if (!pcRef.current) {
                                pcRef.current = createPeerConnection();
                            }
                            await pcRef.current.setRemoteDescription(
                                new RTCSessionDescription(data.offer)
                            )
                            const answer=await pcRef.current.createAnswer()
                            await pcRef.current.setLocalDescription(answer)
                            wsRef.current.send(JSON.stringify({
                                type:"answer",
                                answer:answer,
                                to: senderId
                            }));
                            break;
                        case "answer":
                            if (pcRef.current){
                                await pcRef.current.setRemoteDescription(
                                    new RTCSessionDescription(data.answer)
                                )
                                console.log("answer established🟢")
                                
                            }else{
                                console.log("⚠️ Ignored duplicate answer");
                            }
                            break;
                        case "ice":
                            if (pcRef.current){
                                pcRef.current.addIceCandidate(
                                    new RTCIceCandidate(data.candidate)
                                );
                                console.log("Ice added")
                            }
                            break;
                    }
                };

                ws.onerror = (err) => {
                    console.error("❌ WebSocket error", err);
                };

                ws.onclose = () => {
                    console.log("🔌 WebSocket disconnected");
                };
            } catch (err) {
                console.error("Camera error:", err);
            }
    };
    startCall();
    return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }

            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [callStatus]);


    const handleEndCall = () => {
        if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
        console.log("🔴 PeerConnection closed");
        }
        setCallStatus("idle");
        setIsMuted(false);
        setIsVideoEnabled(true);
        setRoom(null);
        setPeer(null)
        wsRef.current.onclose = () => console.log("WebSocket disconnected");
    };

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            <Sidebar className="hidden lg:flex w-64 shrink-0" />
            
            <div className="flex flex-1 flex-col min-w-0 h-screen">
                {callStatus === 'idle' && <Header />}
                
                <main className="flex-1 overflow-hidden bg-slate-50 relative flex flex-col md:flex-row">
                    <div className={cn(
                        "w-full md:w-80 lg:w-96 shrink-0 z-10 border-r border-b md:border-b-0",
                        callStatus !== 'idle' ? "hidden md:block h-full" : "h-[40vh] md:h-full"
                    )}>
                        <ChatSidebar />
                    </div>

                    <div className={cn(
                        "flex-1 bg-slate-50/50 flex flex-col min-w-0 overflow-hidden relative",
                        callStatus !== 'idle' ? "h-full" : "h-[60vh] md:h-full"
                    )}>
                        
                        {callStatus === 'idle' ? (
                            <div className="flex flex-col h-full">
                                <div className="p-4 md:p-8 pb-4 shrink-0">
                                    <div className="bg-white rounded-xl shadow-sm border p-1.5 flex items-center gap-2 mb-6">
                                        <Search className="h-5 w-5 text-slate-400 ml-2" />
                                        <input type="text" placeholder="Search student name..." className="flex-1 bg-transparent border-none outline-none text-sm p-1" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight mb-4">Upcoming Sessions</h2>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                                    {UPCOMING_SESSIONS.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <CalendarIcon className="h-10 w-10 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {isMentor ? "No sessions found" : "No booked calls"}
                                            </h3>
                                            <p className="text-sm text-slate-500 max-w-xs mt-2">
                                                {isMentor 
                                                    ? "You don't have any upcoming sessions scheduled at the moment."
                                                    : "Ready to practice? Find a mentor and book your first session today!"}
                                            </p>
                                            {!isMentor && (
                                                <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700">
                                                    <Link to="/directory">Browse Mentors</Link>
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {UPCOMING_SESSIONS.map((session) => (
                                                <Card key={session.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                                                <AvatarImage src={session.avatar} />
                                                                <AvatarFallback>U</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-bold text-slate-900">{session.name}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs text-slate-500">{session.role}</span>
                                                                    <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">{session.level}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                                                            <div className="text-right">
                                                                <div className="font-bold text-sm">{session.time}</div>
                                                                <div className={cn("text-xs font-medium", session.statusColor)}>{session.statusText}</div>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                {session.canCancel && (
                                                                    <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(true)}>Cancel</Button>
                                                                )}
                                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-6" onClick={handleStartCall}>Start</Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* ACTIVE CALL INTERFACE */
                            <div className="flex-1 flex flex-col bg-slate-900 text-white h-full relative">
                                <div className={cn(
                                    "flex-1 p-4 gap-4 grid min-h-0",
                                    callStatus==="joined" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                                )}>
                                    <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700/50">
                                        <video
                                            ref={localVideoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className={cn("w-full h-full object-cover transform scale-x-[-1]", !isVideoEnabled && "hidden")}
                                        />
                                        {!isVideoEnabled && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                                <Avatar className="h-32 w-32 border-4 border-slate-700">
                                                    <AvatarFallback className="bg-slate-600 text-4xl">ME</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 bg-black/40 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                                            You {isMuted && '(Muted)'}
                                        </div>
                                    </div>
                                    
                                    <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700/50">
                                        <video
                                            ref={remoteVideoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                     
                                        {isRemoteConnected && <div className="absolute bottom-4 left-4 bg-black/40 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                                            {peer} {isMuted && '(Muted)'}
                                        </div>}
                                    </div>
                                </div>

                                <div className="h-20 shrink-0 flex items-center justify-center gap-4 bg-slate-900/90 backdrop-blur border-t border-slate-800">
                                    <Button variant={isMuted ? "destructive" : "secondary"} size="icon" className="rounded-full h-12 w-12" onClick={() => setIsMuted(!isMuted)}>
                                        {isMuted ? <MicOff /> : <Mic />}
                                    </Button>
                                    <Button variant={!isVideoEnabled ? "destructive" : "secondary"} size="icon" className="rounded-full h-12 w-12" onClick={() => setIsVideoEnabled(!isVideoEnabled)}>
                                        {isVideoEnabled ? <Video /> : <VideoOff />}
                                    </Button>
                                    <Button variant="destructive" size="icon" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700" onClick={handleEndCall}>
                                        <PhoneOff />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400"><Settings /></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <ScheduleModal open={scheduleModalOpen} onOpenChange={setScheduleModalOpen} />
        </div>
    );
}

export default Calls;