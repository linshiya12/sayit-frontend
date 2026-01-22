import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trash2, FileText, Download, Play, Pause, X } from "lucide-react";
import { formatPostDateTime } from "@/utils/Helpers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UniversalShimmer from "../ui/UniversalShimmer";

export function MessageBubble({ message, isMe, onDelete }) {
    const isText = !message.file_type || message.file_type === 'text';
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    // --- AUDIO LOGIC (One at a time) ---
    useEffect(() => {
        const handleGlobalPlay = (e) => {
            // If another message started playing, pause this one
            if (e.detail.messageId !== message.id) {
                audioRef.current?.pause();
                setIsPlaying(false);
            }
        };

        window.addEventListener('playing-audio', handleGlobalPlay);
        return () => window.removeEventListener('playing-audio', handleGlobalPlay);
    }, [message.id]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Dispatch event to stop other audios
            window.dispatchEvent(new CustomEvent('playing-audio', { 
                detail: { messageId: message.id } 
            }));
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // --- DOWNLOAD LOGIC ---
    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || "download.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsDownloaded(true); // Hide button after success
        } catch (err) {
            console.error("Download failed", err);
        }
    };
    
    return (
        <div className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
            
            {/* --- FULL SCREEN IMAGE MODAL --- */}
            {isFullScreen && (
                <div 
                    className="fixed inset-0 z-999 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setIsFullScreen(false)}
                >
                    <button className="absolute top-6 right-6 text-white"><X /></button>
                    <img 
                        src={message.file} 
                        className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-200" 
                        alt="Full view" 
                    />
                </div>
            )}

            <div className="flex gap-2 max-w-[80%] md:max-w-[70%] group">
                {!isMe && (
                    <div className="shrink-0 mt-1">
                        <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage src={message?.author?.prof_photo} />
                            <AvatarFallback>{message?.author?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <div className={cn(
                        "relative shadow-sm overflow-hidden",
                        isMe ? "bg-blue-100 text-slate-900 rounded-2xl rounded-tr-none"
                             : "bg-white text-slate-900 rounded-2xl rounded-tl-none border border-slate-100"
                    )}>

                        {/* Image Content */}
                        {message.file_type === 'image' && (
                            <div className="p-1">
                                <img
                                    src={message.file}
                                    alt="Shared"
                                    onClick={() => setIsFullScreen(true)}
                                    className="rounded-xl w-full max-h-64 object-cover cursor-zoom-in hover:brightness-95 transition-all"
                                    onLoad={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                                />
                                {message.text && <p className="px-3 py-2 text-sm">{message.text}</p>}
                            </div>
                        )}

                        {/* Video Content */}
                        {message.file_type === 'video' && (
                            <div className="p-1">
                                <video
                                    src={message.file}
                                    controls
                                    className="rounded-xl w-full max-h-64 bg-black"
                                    onLoadedData={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                                />
                                {message.text && <p className="px-3 py-2 text-sm">{message.text}</p>}
                            </div>
                        )}

                        {/* Audio Content */}
                        {message.file_type === 'audio' && (
                            <div className="p-3 flex items-center gap-3 min-w-[220px]">
                                <audio 
                                    ref={audioRef} 
                                    src={message.file} 
                                    onEnded={() => setIsPlaying(false)} 
                                />
                                <button 
                                    onClick={togglePlay}
                                    className="bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-4 h-4 text-white fill-current" />
                                    ) : (
                                        <Play className="w-4 h-4 text-white fill-current" />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <div className="h-1 bg-slate-200 rounded-full w-full overflow-hidden">
                                        {/* <div 
                                            className={cn("h-full bg-blue-500", isPlaying ? "animate-progress" : "")} 
                                            style={{ width: isPlaying ? '100%' : '0%', transition: isPlaying ? 'width 15s linear' : 'none' }}
                                        ></div> */}
                                    </div>
                                    <p className="text-[10px] mt-1 text-slate-500 uppercase tracking-widest font-semibold">
                                        {isPlaying ? "Playing..." : "Voice Message"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* File/PDF Content */}
                        {message.file_type === 'docs' && (
                            <div className="p-3 flex items-center gap-3 bg-slate-50/50 rounded-lg m-1 border border-slate-200 min-w-[200px]">
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">Document.pdf</p>
                                    <p className="text-[10px] text-slate-400">PDF File</p>
                                </div>
                                {!isDownloaded && (
                                    <button 
                                        onClick={() => handleDownload(message.file, "document.pdf")}
                                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Text Content */}
                        {isText && (
                            <div className="px-4 py-2">
                                <p className="text-sm leading-relaxed">{message?.body}</p>
                            </div>
                        )}

                        <div className={cn("flex items-center px-4 pb-1 justify-end")}>
                            <span className="text-[9px] text-slate-400 uppercase">{formatPostDateTime(message?.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Delete Action */}
                <div className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center",
                    isMe ? "order-first mr-2" : "ml-2"
                )}>
                    <button
                        onClick={() => onDelete(message?.id)}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}