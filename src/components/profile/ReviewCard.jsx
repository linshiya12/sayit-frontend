import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star,Trash2 } from "lucide-react";

export function ReviewCard({ name, rating, comment, image, isOwner = false, onDelete }) {
    const firstLetter = name ? name[0].toUpperCase() : "?";
    return (
        <div className="shrink-0 w-80 bg-slate-50 p-4 rounded-xl border border-slate-100 snap-start">
            
            <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{firstLetter}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-900">{name}</h4>
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${
                                    i < rating
                                        ? "fill-current"
                                        : "text-slate-200 fill-slate-200"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {isOwner && (
                    <button
                        onClick={onDelete}
                        className="text-slate-400 hover:text-red-500 transition"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {comment}
            </p>
           
        </div>
    );
}
