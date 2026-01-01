import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { MentorList } from "@/components/dashboard/MentorList";
import { PostFeed } from "@/components/dashboard/PostFeed";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      {/* Sidebar - hidden on mobile, visible on lg screens usually, but we'll make it responsive later or just sticky for now */}
      <Sidebar className="hidden lg:flex w-64 shrink-0" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
          <WelcomeBanner />
          <StatsGrid />
          <MentorList />
          <PostFeed />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;