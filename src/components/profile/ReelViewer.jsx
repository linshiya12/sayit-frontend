import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, MoreHorizontal, X, Music, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReelViewer({ open, onOpenChange, reels, initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isMuted, setIsMuted] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH=80

    // Sync index when opening
    useEffect(() => {
        if (open) setCurrentIndex(initialIndex);
    }, [open, initialIndex]);

    const handleScroll = (e) => {
        // Simple vertical scroll simulation
        const delta = e.deltaY;
        if (delta > 50 && currentIndex < reels.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (delta < -50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentReel = reels[currentIndex];
    const islong=currentReel?.description?.length>MAX_LENGTH
    if (!currentReel) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-full h-screen p-0 m-0 border-none bg-black/90 flex items-center justify-center focus:outline-none"
                onWheel={handleScroll} // Simplistic scroll handler
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 rounded-full"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-6 w-6" />
                </Button>

                {/* Video Container (Aspect Ratio Phone) */}
                <div className="relative w-full max-w-sm h-full md:h-[90vh] bg-black md:rounded-xl overflow-hidden shadow-2xl">
                    {/* Background / Video Placeholder */}
                    <div className="absolute inset-0 bg-slate-800">
                        {/* In a real app, this would be a <video> tag */}
                        <video
                            src={currentReel.media_url}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                        />

                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Overlaid UI */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)] from-black/80 via-black/40 to-transparent pt-32 text-white">

                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8 border border-white/20">
                                <AvatarImage src="https://i.pravatar.cc/300?u=hiroshi" />
                                <AvatarFallback>HT</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">Hiroshi Tanaka</span>
                            <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent border-white/50 text-white hover:bg-white/20 ml-2">Follow</Button>
                        </div>

                        {/* Caption */}
                        <p className="text-sm line-clamp-2 mb-3">
                            {expanded||!islong?currentReel?.description:currentReel?.description?.slice(0,MAX_LENGTH)}
                            {islong && (
                                <span
                                    className="text-slate-300 font-medium ml-1 cursor-pointer"
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? "less" : "more"}
                                </span>
                            )}
                        </p>

                        {/* Music */}
                        <div className="flex items-center gap-2 text-xs font-medium opacity-90 overflow-hidden">
                            <Music className="h-3 w-3" />
                            <div className="whitespace-nowrap animate-marquee">Original Audio - Hiroshi Tanaka</div>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-1">
                            <Heart className="h-7 w-7 text-white drop-shadow-md cursor-pointer hover:text-red-500 active:scale-90 transition-all" />
                            <span className="text-xs font-semibold text-white drop-shadow">{currentReel.likes || "12K"}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <MessageCircle className="h-7 w-7 text-white drop-shadow-md cursor-pointer active:scale-90 transition-all" />
                            <span className="text-xs font-semibold text-white drop-shadow">456</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Send className="h-7 w-7 text-white drop-shadow-md cursor-pointer -rotate-12 active:scale-90 transition-all" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <MoreHorizontal className="h-6 w-6 text-white drop-shadow-md cursor-pointer" />
                        </div>
                    </div>

                    {/* Mute Toggle */}
                    <button
                        className="absolute top-4 right-4 bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
                    </button>

                </div>

            </DialogContent>
        </Dialog>
    );
}
