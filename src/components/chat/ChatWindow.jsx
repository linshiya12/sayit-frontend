import React, { useState, useRef, useEffect } from "react";
import { Send, MoreVertical, Phone, Video, Mic, Image as ImageIcon, Smile, ArrowLeft, Paperclip, FileText, X ,Loader2, FileAudio} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MessageBubble } from "./MessageBubble";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import AxiosInstance from "@/api/axiosInstance";
import axios from "axios";

export function ChatWindow({ chat, messages, onSendMessage, onDeleteMessage, onBack }) {
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const currentuser = useSelector((state) => state.auth.user);
    const me=useSelector((state)=>state.auth.user.id)
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100);

        return () => clearTimeout(timer);
    }, [messages]);

    console.log("m",chat)

    const handleSend = async (e) => {
        if (e && e.preventDefault){
            e.preventDefault();
        }
        if (isSending) return; // Prevent double-clicks

        try {
            setIsSending(true);

            if (selectedFile) {
                // 1. Get Presigned URL from your API
                const safeFileName = selectedFile.file.name.replace(/\s+/g, "_");
                const presignedRes = await AxiosInstance.post("s3/presignedurl/", {
                    file_name: safeFileName,
                    file_type: selectedFile.type,
                    folder: "chat_media"
                });

                const { upload_url, file_url } = presignedRes.data;

                await axios.put(upload_url, selectedFile.file, {
                    headers: { "content-type": selectedFile.type },
                });

                // 3. Notify your backend via WebSocket
                onSendMessage({
                    type: selectedFile.type,
                    fileUrl: file_url,
                });

                setSelectedFile(null);

            } else if (newMessage.trim()) {
                // Text-only path
                onSendMessage({
                    type: "text",
                    text_message: newMessage,
                });
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            
            // Detailed error feedback
            if (error.response) {
                alert(`Upload failed: ${error.response.data.message || "Server Error"}`);
            } else if (error.request) {
                alert("Network error: Please check your internet connection.");
            } else {
                alert("An unexpected error occurred.");
            }
        } finally {
            setIsSending(false);
            if (selectedFile?.previewUrl) {
                URL.revokeObjectURL(selectedFile.previewUrl);
            }
            
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat history?")) {
            // Logic for clearing chat
        }
    };

    const handleFileSelect = (type) => {
        if (fileInputRef.current) {
            let accept = "*/*";
            if (type === 'image') accept = "image/*";
            if (type === 'video') accept = "video/*";
            if (type === 'document') accept = ".pdf,.doc,.docx,.txt";
            if (type === 'audio') accept="audio/*, .mp3, .wav, .ogg, .m4a"

            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_FILE_SIZE = 50 * 1024 * 1024; 
        if (file.size > MAX_FILE_SIZE) {
            alert("File is too large! Maximum size is 50MB.");
            e.target.value = null;
            return;
        }
        let type = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else type = 'docs';

        const fileUrl = URL.createObjectURL(file);

        if (type === 'video') {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                // 180 seconds = 3 minutes
                const maxDuration = 180; 

                if (video.duration > maxDuration) {
                    alert("Video must be less than 3 minutes long.");
                    e.target.value = null;
                    return;
                }
                
                setSelectedFile({ file, type, previewUrl: fileUrl });
                setNewMessage(""); 
                e.target.value = null; 
            };

            video.onerror = () => {
                alert("Could not load video metadata.");
                e.target.value = null;
            };

            video.src = fileUrl;
        } else {
            setSelectedFile({ file, type, previewUrl: fileUrl });
            setNewMessage("");
            e.target.value = null;
        }
    };

    const handleRecordingStop = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const otherMember = chat?.members?.find(
        (m) => Number(m.id) !== Number(currentuser?.id)
    );

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            console.log("hloo")
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            if (audioBlob.size > 50 * 1024 * 1024) {
                alert("Too big!");
                return;
            }

            // 2. Package it as a File with a unique name
            const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });

            // 3. IMPORTANT: Put it in the 'selectedFile' state so handleSend can see it
            setSelectedFile({
                file: audioFile,
                type: 'audio', // Matches your Django Enum
                previewUrl: URL.createObjectURL(audioFile)
            });

            // 4. Stop the microphone hardware
            stream.getTracks().forEach(track => track.stop());

            // 5. Tell handleSend to run! 
            // We pass 'null' because there is no "click event" here
            setTimeout(() => handleSend(null), 100); 
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const handleCancelRecording = () => {
        if (mediaRecorderRef.current) {
            // 1. Tell the recorder to stop, but we need to ignore the 'onstop' event
            // We can do this by clearing the onstop function first
            mediaRecorderRef.current.onstop = null; 
            mediaRecorderRef.current.stop();
        }
        
        // 2. Shut off the microphone light
        if (mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        // 3. Reset the UI
        setIsRecording(false);
        audioChunksRef.current = [];
    };

    console.log(otherMember)          
    if (!chat) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <div className="h-10 w-10 bg-slate-200 rounded-lg -rotate-12"></div>
                    <div className="h-10 w-10 bg-slate-300 rounded-lg absolute rotate-6 border-2 border-slate-50"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-1">Start a conversation</h3>
                <p className="max-w-xs">Select a contact from the sidebar to start chatting and learning.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 border-b border-slate-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-500" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <Avatar
                        className="h-10 w-10 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/profile/${otherMember.id}`)}
                    >
                        <AvatarImage src={otherMember.prof_photo} />
                        <AvatarFallback>{otherMember.first_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h3
                            className="font-semibold text-sm text-slate-900 cursor-pointer hover:underline"
                            onClick={() => navigate(`/profile/${otherMember.id}`)}
                        >
                            {otherMember.first_name}
                        </h3>
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            {/* {c === 'online' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>} */}
                            {/* {otherMember.is_online==true?"online":otherMember.last_seen} */}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/profile/${otherMember.id}/`)}>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 bg-red-50 focus:bg-red-100" onClick={handleClearChat}>
                                Clear chat history
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4 bg-slate-50/30">
                {/* Date Separator Example */}
                <div className="flex justify-center my-4">
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        Today
                    </span>
                </div>

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg?.id}
                        message={msg}
                        isMe={msg?.author?.id === me}
                        onDelete={onDeleteMessage}
                    />
                ))}

                {/* Time Remaining Badge (Simulated as per design) */}
                <div className="flex justify-center mt-6 mb-2">
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border border-amber-600 border-t-transparent animate-spin"></span>
                        Time remaining: 00:32:15
                    </span>
                </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                {selectedFile ? (
                    /* --- FILE PREVIEW MODE --- */
                    <div className="flex items-center gap-3 bg-blue-50 p-2 md:p-3 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2">
                        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center border border-blue-200 overflow-hidden shrink-0">
                            {selectedFile.type === 'image' ? (
                                <img src={selectedFile.previewUrl} className="object-cover h-full w-full" alt="preview" />
                            ) : (
                                <FileText className="h-6 w-6 text-blue-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-blue-900">{selectedFile.file.name}</p>
                            <p className="text-[10px] text-blue-600 uppercase font-medium">{selectedFile.type}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setSelectedFile(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                            <Button size="sm" onClick={handleSend} className="bg-blue-600 text-white rounded-xl px-4">
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" /> Send
                                    </>
                                )}
                                
                            </Button>
                        </div>
                    </div>
                ) : isRecording ? (
                    <div className="flex items-center justify-between bg-red-50 p-3 rounded-3xl border border-red-100 animate-pulse">
                        <div className="flex items-center gap-2 text-red-600 font-medium px-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                            <span>Recording... </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-slate-700"
                                onClick={handleCancelRecording}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4"
                                onClick={handleRecordingStop}
                            >
                                <Send className="h-4 w-4 mr-1" /> Stop
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSend}
                        className="flex items-end gap-2 bg-slate-50 p-1.5 rounded-3xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 rounded-full shrink-0">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem onClick={() => handleFileSelect('image')}>
                                    <ImageIcon className="h-4 w-4 mr-2" /> Image
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileSelect('video')}>
                                    <Video className="h-4 w-4 mr-2" /> Video
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileSelect('document')}>
                                    <FileText className="h-4 w-4 mr-2" /> Document
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileSelect('audio')}>
                                    <FileAudio className="h-4 w-4 mr-2" /> Audio
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Input
                            placeholder="Type a Message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="border-none bg-transparent focus-visible:ring-0 px-2 min-h-9 py-2 max-h-32 resize-none"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full shrink-0"
                            onClick={startRecording}
                        >
                            <Mic className="h-5 w-5" />
                        </Button>

                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "h-9 w-9 rounded-full shrink-0 transition-all duration-200 shadow-md",
                                newMessage.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-200 text-slate-400"
                            )}
                            disabled={!newMessage.trim()}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
