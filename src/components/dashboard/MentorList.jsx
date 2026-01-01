import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar } from "lucide-react";
import { ArrowRight } from "lucide-react";

const mentors = [
    {
        name: "Emma Rodriguez",
        role: "Spanish Native",
        rating: 4.9,
        reviews: 127,
        price: "$25/hr After",
        free: "1st Hour Free",
        image: "https://i.pravatar.cc/150?u=emma",
        flag: "🇪🇸"
    },
    {
        name: "Hiroshi Tanaka",
        role: "Japanese Native",
        rating: 4.8,
        reviews: 94,
        price: "$28/hr After",
        free: "1st Hour Free",
        image: "https://i.pravatar.cc/150?u=hiroshi",
        flag: "🇯🇵"
    },
    {
        name: "Sophie Dupont",
        role: "French Native",
        rating: 4.7,
        reviews: 86,
        price: "$24/hr After",
        free: "1st Hour Free",
        image: "https://i.pravatar.cc/150?u=sophie",
        flag: "🇫🇷"
    },
    {
        name: "Marco Bianchi",
        role: "Italian Native",
        rating: 4.9,
        reviews: 112,
        price: "$26/hr After",
        free: "1st Hour Free",
        image: "https://i.pravatar.cc/150?u=marco",
        flag: "🇮🇹"
    },
];

export function MentorList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Recommended Mentors</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {mentors.map((mentor) => (
                    <Card key={mentor.name} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-0">
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <Avatar className="h-12 w-12 border-2 border-background group-hover:scale-110 transition-transform">
                                            <AvatarImage src={mentor.image} />
                                            <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-sm">{mentor.name}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                {mentor.role} <span className="text-sm">{mentor.flag}</span>
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-medium">{mentor.rating}</span>
                                                <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-blue-600 font-medium">{mentor.free}</span>
                                        <span className="text-muted-foreground">{mentor.price}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                            <MessageSquare className="h-3.5 w-3.5" /> Chat
                                        </Button>
                                        <Button size="sm" className="h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700">
                                            <Calendar className="h-3.5 w-3.5" /> Book
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
