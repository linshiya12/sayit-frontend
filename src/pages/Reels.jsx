import React from "react";
import { GlobalReelViewer } from "@/components/reels/GlobalReelViewer";
import { Sidebar } from "@/components/layout/Sidebar";

export function Reels() {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* 
                We include Sidebar here because GlobalReelViewer is full screen.
                On desktop, we want the sidebar to be visible on the left.
                On mobile, it might be hidden or this page might be a separate route without layout.
                For now, matching the requested layout where "Sidebar" exists.
             */}
            <Sidebar className="hidden lg:flex w-64 shrink-0 border-r border-white/20 bg-background" />

            <div className="flex-1 min-w-0">
                <GlobalReelViewer />
            </div>
        </div>
    );
}
