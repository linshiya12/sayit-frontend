import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X, Smile } from "lucide-react";
import formatPostDate from "@/utils/Helpers";

export function PostViewer({ open, onOpenChange, post }) {
    if (!post) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-white border-none shadow-2xl focus:outline-none">

                {/* Left: Image/Video Section */}
                <div className="flex-1 bg-black flex items-center justify-center relative min-h-[40vh] md:min-h-full">
                    <img
                        src={post.media_url}
                        alt="Post content"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                {/* Right: Details Section */}
                <div className="w-full md:w-[400px] flex flex-col h-[50vh] md:h-full bg-white shrink-0">

                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://i.pravatar.cc/300?u=hiroshi" />
                                <AvatarFallback>HT</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold text-slate-900">Hiroshi Tanaka</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-5 w-5 text-slate-600" />
                        </Button>
                    </div>

                    {/* Comments / Caption Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Caption */}
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src="https://i.pravatar.cc/300?u=hiroshi" />
                                <AvatarFallback>HT</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <span className="font-semibold text-slate-900 mr-2">Hiroshi Tanaka</span>
                                <span className="text-slate-700 leading-relaxed">{post.description || "Enjoying a beautiful day!"}</span>
                                <div className="text-xs text-slate-400 mt-1">2d</div>
                            </div>
                        </div>

                        {/* Mock Comments */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <span className="font-semibold text-slate-900 mr-2">User {i}</span>
                                    <span className="text-slate-700">Great photo! 🔥</span>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-semibold">
                                        <span>2d</span>
                                        <span className="cursor-pointer hover:text-slate-600">Reply</span>
                                    </div>
                                </div>
                                <Heart className="h-3 w-3 text-slate-400 ml-auto mt-2 cursor-pointer hover:text-red-500" />
                            </div>
                        ))}
                    </div>

                    {/* Engagement & Footer */}
                    <div className="border-t shrink-0">
                        <div className="p-4 pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Heart className="h-6 w-6 text-slate-900 cursor-pointer hover:text-slate-600 transition-colors" />
                                <MessageCircle className="h-6 w-6 text-slate-900 cursor-pointer hover:text-slate-600 transition-colors" />
                                <Send className="h-6 w-6 text-slate-900 cursor-pointer hover:text-slate-600 transition-colors" />
                            </div>
                            <Bookmark className="h-6 w-6 text-slate-900 cursor-pointer hover:text-slate-600 transition-colors" />
                        </div>
                        <div className="px-4 pb-2">
                            <div className="text-sm font-semibold text-slate-900">{post.likes?.toLocaleString() || "1,240"} likes</div>
                            <div className="text-[10px] uppercase text-slate-400 tracking-wide mt-1"> {formatPostDate(post.created_at)}</div>
                        </div>

                        {/* Comment Input */}
                        <div className="border-t p-4 flex items-center gap-3">
                            <Smile className="h-6 w-6 text-slate-400 cursor-pointer" />
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent border-none text-sm outline-none placeholder:text-slate-400"
                            />
                            <button className="text-blue-500 font-semibold text-sm disabled:opacity-50 hover:text-blue-700">Post</button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
