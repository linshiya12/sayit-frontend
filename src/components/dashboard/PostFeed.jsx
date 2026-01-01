import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function PostFeed() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Explore Posts</h2>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Create Post
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent p-0 w-auto gap-4 border-b rounded-none h-auto pb-2 justify-start">
                    <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 font-medium"
                    >
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        value="mentors"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 font-medium text-muted-foreground"
                    >
                        Mentors
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 font-medium text-muted-foreground"
                    >
                        Following
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6 space-y-6">
                    <PostCard />
                    <PostCard />
                </TabsContent>
            </Tabs>

        </div>
    );
}

function PostCard() {
    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="p-4 flex-row gap-4 items-start space-y-0">
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=elena" />
                    <AvatarFallback>EP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-semibold">Elena Petrova</h3>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <p className="text-sm leading-relaxed">
                    Just published a new guide on mastering Russian verb conjugations! Check it out in the resources section. What aspects of Russian grammar do you find most challenging? <span className="text-blue-500">#RussianLanguage #LanguageLearning</span>
                </p>

                <div className="rounded-xl overflow-hidden bg-muted aspect-video relative">
                    <img
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
                        alt="Post content"
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                    />
                </div>
            </CardContent>
            <CardFooter className="p-4 flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 px-2 gap-1.5 h-8">
                        <Heart className="h-4 w-4" /> <span className="text-xs">24</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground px-2 gap-1.5 h-8">
                        <MessageCircle className="h-4 w-4" /> <span className="text-xs">8</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground px-2 h-8">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground px-2 h-8">
                    <Bookmark className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
