import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function WriteReviewModal({ open, onOpenChange, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit({ rating, review });
        onOpenChange(false);
        setRating(0);
        setReview("");
    };
    console.log(rating,review)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Write a Review</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">How was your experience?</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors duration-200",
                                            (hoveredRating || rating) >= star
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-slate-100 text-slate-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-amber-600 min-h-[20px]">
                            {rating === 1 && "Terrible"}
                            {rating === 2 && "Bad"}
                            {rating === 3 && "Okay"}
                            {rating === 4 && "Good"}
                            {rating === 5 && "Excellent"}
                        </p>
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium text-slate-700">Detailed Review (Optional)</label>
                        <Textarea
                            placeholder="Tell us more about your experience..."
                            className="min-h-[100px] resize-none"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    >
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
