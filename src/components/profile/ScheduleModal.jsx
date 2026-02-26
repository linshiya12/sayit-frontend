import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Clock, Globe, X, Sun, Sunset, Sunrise, Check } from "lucide-react";
import { format, isBefore, startOfDay, addDays, parse, isAfter, isValid } from "date-fns";
import AxiosInstance from "@/api/axiosInstance";

const TIME_GROUPS = {
    Morning: { icon: Sunrise, slots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"] },
    Afternoon: { icon: Sun, slots: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"] },
    Evening: { icon: Sunset, slots: ["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"] },
};

export function ScheduleModal({ open, onOpenChange }) {
    const [availability, setAvailability] = useState({}); 
    const [savedSlots, setSavedSlots] = useState([]);    
    const [currentDate, setCurrentDate] = useState(addDays(new Date(), 1));
    const [activeTab, setActiveTab] = useState("Morning");
    
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // --- CRITICAL: Helper to convert DB UTC string to Local Time ---
    const toLocalTime = (utcString) => {
        if (!utcString) return null;
        const date = new Date(utcString); 
        return isValid(date) ? date : null;
    };

    const getDateKey = (date) => (date instanceof Date && !isNaN(date) ? format(date, "yyyy-MM-dd") : "");
    const currentDateKey = currentDate ? getDateKey(currentDate) : null;
    const currentSlots = currentDateKey ? (availability[currentDateKey] || []) : [];

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const maxDate = addDays(tomorrow, 14);

    // Checks if a slot exists in the DB by comparing Local versions
    const isSlotAlreadySaved = (dateKey, timeStr) => {
        return savedSlots.some(slot => {
            const localDate = toLocalTime(slot.available_time);
            if (!localDate) return false;
            return format(localDate, "yyyy-MM-dd") === dateKey && format(localDate, "hh:mm a") === timeStr;
        });
    };

    const fetchAvailability = async () => {
        try {
            const response = await AxiosInstance.get("availability/");
            setSavedSlots(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (open) fetchAvailability();
    }, [open]);

    const toggleSlot = (time) => {
        if (!currentDateKey) return;
        setAvailability(prev => {
            const slots = prev[currentDateKey] || [];
            const newSlots = slots.includes(time) ? slots.filter(t => t !== time) : [...slots, time];
            const newAvailability = { ...prev, [currentDateKey]: newSlots };
            if (newSlots.length === 0) delete newAvailability[currentDateKey];
            return newAvailability;
        });
    };

    const handleSave = async () => {
        // Converts your Local selection to ISO String (UTC) for the Backend
        const payload = Object.entries(availability).flatMap(([dateStr, times]) => 
            times.map(timeStr => {
                const localDateTime = parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd hh:mm a", new Date());
                return { available_time: localDateTime.toISOString() };
            })
        );

        if (payload.length === 0) return onOpenChange(false);

        try {
            await AxiosInstance.post("availability/", payload);
            setAvailability({});
            await fetchAvailability();
            onOpenChange(false);
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    // Grouping Saved slots by their LOCAL values so Summary matches the Selection
    const groupedSavedSlots = savedSlots.reduce((acc, slot) => {
        const localDate = toLocalTime(slot.available_time);
        if (localDate) {
            const dateKey = format(localDate, "yyyy-MM-dd");
            const timeStr = format(localDate, "hh:mm a");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(timeStr);
        }
        return acc;
    }, {});

    const allRelevantDates = Array.from(new Set([...Object.keys(availability), ...Object.keys(groupedSavedSlots)])).sort();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 flex flex-col h-[90vh] md:h-auto md:max-h-[800px]">
                <DialogHeader className="p-4 border-b bg-white z-10">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Set Availability
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left: Calendar & Timezone Info */}
                    <div className="p-4 border-b lg:border-b-0 lg:border-r bg-white shrink-0 lg:w-80 flex flex-col items-center">
                        <Calendar
                            mode="single"
                            selected={currentDate}
                            onSelect={(d) => d && setCurrentDate(d)}
                            disabled={(date) => isBefore(date, tomorrow) || isAfter(date, maxDate)}
                            fromDate={tomorrow}
                        />
                        <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-[11px] flex items-center gap-2 w-full">
                            <Globe className="h-3 w-3" />
                            <span>Showing time in <b>{userTimezone}</b></span>
                        </div>
                    </div>

                    {/* Right: Slots & Summary */}
                    <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
                        <div className="p-4 flex-1 overflow-y-auto">
                            <h3 className="font-semibold mb-3">
                                Select for <span className="text-blue-600">{currentDate ? format(currentDate, "MMM d") : ""}</span>
                            </h3>
                            
                            <div className="flex gap-2 mb-4 bg-white p-1 border rounded-lg">
                                {Object.keys(TIME_GROUPS).map(key => (
                                    <button 
                                        key={key} 
                                        onClick={() => setActiveTab(key)}
                                        className={cn("flex-1 py-1.5 text-xs rounded-md transition-all", activeTab === key ? "bg-slate-900 text-white" : "hover:bg-slate-100")}
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {TIME_GROUPS[activeTab].slots.map(time => {
                                    const isSaved = isSlotAlreadySaved(currentDateKey, time);
                                    const isSelected = currentSlots.includes(time);
                                    return (
                                        <button
                                            key={time}
                                            disabled={isSaved}
                                            onClick={() => toggleSlot(time)}
                                            className={cn(
                                                "py-2 text-xs rounded-md border flex items-center justify-center gap-2",
                                                isSaved ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                                isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:border-blue-300"
                                            )}
                                        >
                                            {isSaved && <Check className="h-3 w-3" />} {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Unified Summary Section */}
                        <div className="bg-white border-t p-4 max-h-60 overflow-y-auto">
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2">Review Schedule</h4>
                            <div className="space-y-2">
                                {allRelevantDates.map(dateKey => (
                                    <div key={dateKey} className="flex gap-3 items-start bg-slate-50 p-2 rounded border">
                                        <div className="text-xs font-bold w-16">{format(parse(dateKey, "yyyy-MM-dd", new Date()), "MMM d")}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {(groupedSavedSlots[dateKey] || []).map(t => (
                                                <span key={t} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">{t}</span>
                                            ))}
                                            {(availability[dateKey] || []).map(t => (
                                                <span key={t} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t">
                            <Button className="w-full bg-blue-600 h-10" onClick={handleSave} disabled={Object.keys(availability).length === 0}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}