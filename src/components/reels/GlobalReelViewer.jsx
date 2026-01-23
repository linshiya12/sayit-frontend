import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/Button";
import { Input } from "../ui/input";
import AxiosInstance from "@/api/axiosInstance";
import {
    Heart,
    MessageCircle,
    Send,
    MoreHorizontal,
    Music,
    Volume2,
    VolumeX,
    X,
    Trash2,
    Bookmark,
    Edit,
    Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import formatPostDate from "@/utils/Helpers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UniversalShimmer from "../ui/UniversalShimmer";

const REPORT_REASONS = [
    "It's spam",
    "Nudity or sexual activity",
    "Hate speech or symbols"
];


export function GlobalReelViewer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef(null);
    const [videopost,setVideoPost]=useState([]);
    const [loading,setLoading]=useState(true)

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        }
    }, [currentIndex]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    useEffect(()=>{
        const fetchUserPosts = async () => {
            try {
                const response = await AxiosInstance.get("getpost/");
                setVideoPost(response.data.videos);
                console.log(response?.data)

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPosts()
    },[])

    return (
        <div
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white no-scrollbar scroll-smooth"
        >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

            {videopost.map((reel, index) => (
                <ReelItem
                    key={reel.id}
                    reel={reel}
                    isActive={index === currentIndex}
                    isMuted={isMuted}
                    toggleMute={() => setIsMuted(!isMuted)}
                />
            ))}
        </div>
    );
}

function ReelItem({ reel, isActive, isMuted, toggleMute }) {
    const videoRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [loading,setLoading]=useState(false)
    const user=useSelector((state)=>state.auth.user)
    const navigate=useNavigate()
    const [commentText,setCommentText]=useState("")
    const [loadingComments,setLoadingComments]=useState(false)
    const [comments, setComments] = useState([]);
    const [totalLikes,setTotalLikes] = useState(0)

  
    useEffect(() => {
        if (!isActive) {
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.currentTime = 0;
            setShowMessages(false);
            setShowReportMenu(false);
        } else {
            if (showMessages || showReportDialog) {
                videoRef.current?.pause();
            } else {
                videoRef.current?.play().catch(() => { });
            }
        }
    }, [isActive, showMessages, showReportDialog]);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const res = await AxiosInstance.get(
                    `getfollow/?user_id=${reel.user.id}`
                );
                setIsFollowing(res.data.is_following);
            } catch (error) {
                console.log("Follow status error", error);
            }
        };

        fetchFollowStatus();
    }, [reel.user.id]);

    const handleFollow = async () => {
        if (loading) return;
        setLoading(true);
        
        try {
            if (!isFollowing) {
                await AxiosInstance.post("follow/", { following: reel.user.id });
            } else {
                await AxiosInstance.delete("follow/", {
                    data: { following: reel.user.id }
                });
            }
            setIsFollowing(prev => !prev);
            
        } catch (error) {
            console.log(reel.user.id)
            console.log("Follow error:", error);
        }finally {
            setLoading(false);
        }
    };
    
    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const res = await AxiosInstance.get(`comment/?post_id=${reel.id}`);
            setComments(res.data.comments);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (!reel?.id) return;
        fetchComments();
    }, [reel.id]);

    const handleCommentAdd=async()=>{
        if (!commentText.trim()) return;
        const data={content:commentText,post_id:reel.id}
        try{
            const response=await AxiosInstance.post("comment/",data)
            setCommentText("");
            fetchComments()
            toast.success("comment added successfully")
        }catch(error){
            console.log(error)
        }
    }
    const handleDeleteComment = async (id) => {
        try{
            const response=await AxiosInstance.delete(`comment/?comment_id=${id}`)
            setComments(current => current.filter(c => c.id !== id));
            toast.success("comment deleted successfully")
        }catch(error){
            console.log(error)
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Reel by ${reel.user.first_name}`,
                    text: reel.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Link copied to clipboard!");
        }
    };
    
    useEffect(() => {
        const fetchLike = async () => {
            try {
                const response = await AxiosInstance.get(`like/${reel.id}`);
                setIsLiked(response.data.is_liked);
                setTotalLikes(response.data.total_likes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLike();
    }, [reel.id]);

    const handleLike = async () => {
        const prevLiked = isLiked;
        const prevCount = totalLikes;
        const data={ post: reel.id }
        try {
            if (!isLiked) {
                setIsLiked(true);
                setTotalLikes(prev => prev + 1);

                await AxiosInstance.post("like/",data);
            } else {
                setIsLiked(false);
                setTotalLikes(prev => prev - 1);

                await AxiosInstance.put(`like/?post=${reel.id}`);
            }
        } catch (error) {
            setIsLiked(prevLiked);
            setTotalLikes(prevCount);
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900">
            {/* Video Container */}
            <div className="relative w-full h-full max-w-md md:max-w-lg mx-auto bg-black md:border-x md:border-white/10 transition-all duration-300">
                <video
                    ref={videoRef}
                    src={reel.media_url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={!isMuted}
                />

                {/* Mute Toggle */}
                <button
                    className="absolute top-20 right-4 z-20 bg-black/40 p-2 rounded-full backdrop-blur-md"
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                >
                    {!isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                </button>

                {/* Overlays (Gradient) */}
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

                {/* Content */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 pb-20 md:pb-8 flex items-end justify-between z-10 transition-opacity duration-300 ${showMessages ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex-1 mr-12 space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white" onClick={() => navigate(`/profile/${reel.user.id}`)}>
                                <AvatarImage src={reel.user.prof_photo} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm md:text-base drop-shadow-md">{reel.user.first_name}</span>
                            {user.id!=reel.user.id && (
                                <Button
                                    variant={isFollowing ? "secondary" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "h-7 text-xs rounded-full px-4 transition-all duration-300",
                                        isFollowing
                                            ? "bg-white text-black hover:bg-white/90"
                                            : "border-white/40 bg-transparent text-white hover:bg-white/20"
                                    )}
                                    disabled={loading}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm md:text-base line-clamp-2 drop-shadow-sm">{reel.description}</p>
                            <div className="flex items-center gap-2 text-xs md:text-sm font-medium opacity-90">
                                <Music className="h-3 w-3 animate-pulse" />
                            <div className="text-[10px] uppercase text-slate-400 tracking-wide mt-1">{formatPostDate(reel.created_at)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="flex flex-col items-center gap-6 pb-2">
                        {/* Like */}
                        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}>
                            <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-all backdrop-blur-sm hover:bg-white/20">
                                <Heart
                                    className={cn("h-7 w-7 transition-colors duration-300 shadow-sm", isLiked ? "text-red-500 fill-red-500" : "text-white")}
                                />
                            </div>
                            <span className="text-xs font-semibold text-white drop-shadow-md">
                               {totalLikes?(totalLikes):0}
                            </span>
                        </div>

                        {/* Messages */}
                        <ActionButton
                            icon={MessageCircle}
                            label={comments.length}
                            onClick={() => setShowMessages(true)}
                        />

                        {/* Share */}
                        <ActionButton
                            icon={Send}
                            onClick={handleShare}
                            className="-rotate-12"
                        />

                        {/* Save (Bookmark) */}
                        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setIsSaved(!isSaved)}>
                            <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-all backdrop-blur-sm hover:bg-white/20">
                                <Bookmark
                                    className={cn("h-7 w-7 transition-colors duration-300 shadow-sm", isSaved ? "text-yellow-400 fill-yellow-400" : "text-white")}
                                />
                            </div>
                        </div>

                        {/* More / Report */}
                        <div className="relative">
                            <ActionButton
                                icon={MoreHorizontal}
                                onClick={() => setShowReportMenu(!showReportMenu)}
                            />
                            {showReportMenu && (
                                <div className="absolute bottom-12 right-0 bg-white text-slate-900 rounded-lg shadow-xl py-1 w-32 animate-in fade-in zoom-in-95 duration-200 origin-bottom-right z-50">
                                    {user.id==reel.user.id ? (
                                        <>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-medium flex items-center gap-2"
                                                onClick={() => { alert("Edit functionality coming soon"); setShowReportMenu(false); }}
                                            >
                                                <Edit className="h-4 w-4" /> Edit
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                                onClick={() => { alert("Delete functionality coming soon"); setShowReportMenu(false); }}
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                                onClick={() => { setShowReportMenu(false); setShowReportDialog(true); }}
                                            >
                                                <Flag className="h-4 w-4" /> Report
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Not interested</button>
                                        </>
                                    )}
                                    <div className="border-t mt-1 pt-1">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 text-slate-500"
                                            onClick={() => setShowReportMenu(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Compact Message Panel */}
                {showMessages && (
                    <>
                        {/* Backdrop to close */}
                        <div className="absolute inset-0 bg-black/40 z-20" onClick={() => setShowMessages(false)} />

                        {/* Panel */}
                        <div className="absolute bottom-4 left-4 right-4 h-[50%] bg-white text-slate-900 rounded-2xl shadow-2xl z-30 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                            <div className="flex items-center justify-between p-3 border-b">
                                <span className="font-semibold text-sm">Comments ({comments.length})</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setShowMessages(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-slate-50 no-scrollbar">
                                {loadingComments ? (<UniversalShimmer/>):(
                                    comments.map(comment => (
                                        <Comment
                                            key={comment.id}
                                            user={comment.user_id}
                                            content={comment.content}
                                            created_at={comment.created_at}
                                            onDelete={() => handleDeleteComment(comment.id)}
                                        />
                                    ))
                                )}
                            </div>

                            <div className="p-3 border-t bg-white flex items-center gap-2 rounded-b-2xl">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src="https://i.pravatar.cc/300?u=me" />
                                    <AvatarFallback>ME</AvatarFallback>
                                </Avatar>
                                 <Input
                                    placeholder="Add a comment..."
                                    className="h-8 text-sm border-none bg-slate-100 focus-visible:ring-1"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCommentAdd()}
                                />
                                <Button size="sm" variant="ghost" className="text-blue-600 font-semibold px-2 h-8" onClick={()=>handleCommentAdd()}>Post</Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Report Dialog using Radix/Shadcn UI Dialog would be cleaner, but simple overlay here to match "custom" request */}
                <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-center font-bold text-lg">Report</DialogTitle>
                        </DialogHeader>
                        <div className="p-0">
                            <p className="text-sm font-semibold text-slate-500 px-4 pb-2">Why are you reporting this post?</p>
                            <div className="flex flex-col">
                                {REPORT_REASONS.map((reason) => (
                                    <button
                                        key={reason}
                                        className="text-left px-4 py-3.5 border-t hover:bg-slate-50 text-slate-700 transition-colors"
                                        onClick={() => { alert(`Reported for: ${reason}`); setShowReportDialog(false); }}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}

function Comment({ user, content, created_at, onDelete }) {
    const currentuser=useSelector((state)=>state.auth.user);
    const isOwn = String(currentuser?.id) === String(user.id);
    return (
        <div className="flex gap-3 group">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.prof_photo} />
                <AvatarFallback>{user.first_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{user.first_name}</span>
                        <span className="text-[10px] text-slate-400">{formatPostDate(created_at)}</span>
                    </div>
                    {isOwn && (
                        <button
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{content}</p>
            </div>
        </div>
    );
}

function ActionButton({ icon, label, onClick, className }) {
    const Icon = icon;
    return (
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onClick}>
            <div className="p-2 rounded-full bg-white/10 group-active:scale-90 transition-all backdrop-blur-sm hover:bg-white/20">
                <Icon className={cn("h-7 w-7 text-white shadow-sm", className)} />
            </div>
            {label && <span className="text-xs font-semibold text-white drop-shadow-md">{label}</span>}
        </div>
    );
}
