import React from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage  } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";


export function Header() {
    const user=useSelector((state)=>state.auth.user)
    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4 w-1/3">
                {/* Placeholder for search if needed, usually in header */}
                <div className="relative w-full max-w-sm hidden md:block">
                    {/* Search could go here */}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                </Button>

                <div className="flex items-center gap-3 pl-2 border-l">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-105 cursor-pointer">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-sm">
                        <span className="font-semibold text-xs">{user?.first_name}</span>
                        <Badge variant="outline" className="h-5 text-[10px] px-1.5 border-amber-200 text-amber-700 bg-amber-50">
                            Premium
                        </Badge>
                    </div>
                </div>
            </div>
        </header>
    );
}
