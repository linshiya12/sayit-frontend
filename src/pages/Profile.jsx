import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Calendar, Edit3, Settings, MapPin, BadgeCheck, ShieldCheck, Book, Play, Plus, GraduationCap } from "lucide-react";
import { ReviewCard } from "@/components/profile/ReviewCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { ScheduleModal } from "@/components/profile/ScheduleModal";
import { ReelViewer } from "@/components/profile/ReelViewer";
import { PostViewer } from "@/components/profile/PostViewer";
import { CreatePostModal } from "@/components/profile/CreatePostModal";
import AxiosInstance from "@/api/axiosInstance";
import UniversalShimmer from "@/components/ui/UniversalShimmer";

export function Profile() {
    const navigate = useNavigate();
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedReelIndex, setSelectedReelIndex] = useState(null);
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [imagePost,setImagePost] = useState([])
    const [videoPost,setVideoPost] = useState([])
    const [user,setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const [totalposts,setTotalposts]=useState(0)

    const fetchUserPosts = async () => {
        try {
            const response = await AxiosInstance.get("getuserpost/");
            setImagePost(response.data.images);
            setVideoPost(response.data.videos);
            setUser(response.data.user);
            setTotalposts(response?.data?.images?.length+response?.data?.videos?.length)
            console.log(response?.data)

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();   
    }, []);

    console.log("user",user)
        console.log("v",videoPost)
        console.log("i",imagePost)
    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            <Sidebar className="hidden lg:flex w-64 shrink-0" />
            <div className="flex flex-1 flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
                    <div className="max-w-4xl mx-auto space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Content Wrapper */}

                        {loading?(<UniversalShimmer rows={5} avatar image />):(
                        <div className="bg-white rounded-3xl shadow-sm border p-8 relative overflow-hidden">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100"
                                    onClick={() => navigate('/settings')}
                                >
                                    <Settings className="h-5 w-5 text-slate-500" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100"
                                    onClick={() => setCreatePostOpen(true)}
                                >
                                    <Plus className="h-5 w-5 text-slate-500" />
                                </Button>
                            </div>

                            {/* Header Info */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src={user.prof_photo} />
                                        <AvatarFallback>HT</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
                                        {user.role=="mentor"?(<Book className="h-6 w-6 text-blue-500 fill-blue-50" />):
                                        (<GraduationCap className="h-6 w-6 text-blue-500 fill-blue-50" />)}
                                    </div>
                                </div>

                                <div className="space-y-2 max-w-lg mx-auto text-center">
                                    <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                                        {user.first_name+" "+user.last_name}
                                    </h1>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Passionate language teacher with 8+ years of experience. Specialized in French and English instruction using immersive learning techniques.
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 rounded-full px-4">
                                            <MapPin className="h-3 w-3" /> Native: {user.native_language}
                                        </Badge>
                                        {user.spoken_languages.map((lang)=>(
                                        <Badge key={lang.id} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 rounded-full px-4">
                                            {lang.spoken_language}
                                        </Badge>
                                        ))}
                                        
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-center gap-12 py-4 border-t border-b border-slate-50 w-full max-w-md mx-auto my-0.5">
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg text-slate-900">{totalposts}</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Post</p>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg text-slate-900">15.3K</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg text-slate-900">892</h3>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Following</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2 pb-6">
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 gap-4 h-10 shadow-lg shadow-blu"
                                        onClick={() => setScheduleOpen(true)}
                                    >
                                        <Calendar className="h-4 w-4" /> Schedule
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-6 gap-2 h-10"
                                        onClick={() => navigate('/settings')}
                                    >
                                        <Edit3 className="h-4 w-4" /> Edit Profile
                                    </Button>
                                </div>

                                {/* Reviews Section */}
                                {user.role=="mentor"&&
                                    <div className="space-y-4 w-full text-left">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-slate-900">4.9</span>
                                                <div className="flex text-amber-400">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <Star className="h-4 w-4 fill-current" />
                                                </div>
                                                <span className="text-sm text-slate-500">(120 students)</span>
                                            </div>
                                            <Button variant="link" className="text-blue-600 text-xs font-semibold">See all reviews</Button>
                                        </div>

                                        <div
                                            className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x"
                                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                        >
                                            <style>{`
                                    .overflow-x-auto::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                            <ReviewCard
                                                name="Aisha Patel"
                                                rating={5}
                                                image="https://i.pravatar.cc/150?u=aisha"
                                                comment="Amazing mentor! Her teaching style is very engaging and effective. I learned so much in just a few sessions."
                                            />
                                            <ReviewCard
                                                name="John Smith"
                                                rating={5}
                                                image="https://i.pravatar.cc/150?u=john"
                                                comment="Hiroshi is incredibly patient and knowledgeable. Highly recommended!"
                                            />
                                            <ReviewCard
                                                name="Emma Wilson"
                                                rating={4}
                                                image="https://i.pravatar.cc/150?u=emma"
                                                comment="Great lessons, very structured. Would love more conversation practice next time."
                                            />
                                        </div>
                                    </div>
                                }

                                {/* Content Tabs */}
                                <Tabs defaultValue="posts" className="w-full pt-4">
                                    {/* Changed inline-flex to flex, removed relative/translate positioning */}
                                    <div className="bg-slate-100 p-1 rounded-xl flex mb-6 w-full max-w-md mx-auto">
                                        <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 h-9">
                                            <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Posts</TabsTrigger>
                                            <TabsTrigger value="reels" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Reels</TabsTrigger>
                                            <TabsTrigger value="saved" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Saved</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="posts" className="mt-0">
                                        <div className="grid grid-cols-3 gap-1 md:gap-4 pb-4">
                                            {imagePost.map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="aspect-square bg-slate-200 md:rounded-2xl overflow-hidden relative group cursor-pointer"
                                                    onClick={() => setSelectedPost(post)}
                                                >
                                                    <img
                                                        src={post.media_url}
                                                        alt="Post"
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="flex gap-4 text-white font-bold">
                                                            <span className="flex items-center gap-1"><Star className="h-5 w-5 fill-white" /> {post.likes_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="reels" className="mt-0">
                                        <div className="grid grid-cols-3 gap-1 md:gap-4">
                                            {videoPost.map((reel, idx) => (
                                                <div
                                                    key={reel.id}
                                                    style={{ aspectRatio: '9/16' }}
                                                    className="bg-slate-200 md:rounded-2xl overflow-hidden relative group cursor-pointer"
                                                    onClick={() => setSelectedReelIndex(idx)}
                                                >
                                                  
                                                    <video
                                                        src={reel.media_url}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                    />

                                                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)] from-black/60 via-transparent to-transparent flex flex-col justify-end p-2 md:p-3">
                                                        <div className="text-white flex items-center gap-1 text-xs md:text-sm font-semibold">
                                                            <Play className="h-3 w-3 fill-white" />
                                                            8000
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="saved" className="mt-0">
                                        <div className="flex h-32 items-center justify-center text-slate-400 text-sm">
                                            No saved items yet
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                     
                    )}
                    </div>
                </main>
            </div>

            <ScheduleModal open={scheduleOpen} onOpenChange={setScheduleOpen} />

            {/* Viewers */}
            <PostViewer
                open={!!selectedPost}
                onOpenChange={(open) => !open && setSelectedPost(null)}
                post={selectedPost}
            />
            <ReelViewer
                open={selectedReelIndex !== null}
                onOpenChange={(open) => !open && setSelectedReelIndex(null)}
                reels={videoPost}
                initialIndex={selectedReelIndex || 0}
            />
            <CreatePostModal
                open={createPostOpen}
                onOpenChange={setCreatePostOpen}
                onPostCreated={fetchUserPosts}
            />
        </div>
    );
}
