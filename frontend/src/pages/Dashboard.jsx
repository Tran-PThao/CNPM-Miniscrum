import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import SprintProgress from "../components/SprintProgress";
import MyTasks from "../components/MyTasks";
import RecentActivity from "../components/RecentActivity";
import SprintStats from "../components/SprintStats";
import FAB from "../components/FAB";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Sidebar */}
      <Sidebar activePage="Dashboard" />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-surface">
        {/* Top Bar */}
        <TopBar />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Welcome / Sprint Header */}
          <div className="mb-10">
            <h2 className="editorial-anchor text-4xl text-on-surface tracking-tight mb-2">
              Sprint 1 Overview
            </h2>
            <p className="text-on-surface-variant font-medium">
              Tactile Precision Dashboard • Nov 14 — Nov 28
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Row 1: Progress + Tasks */}
            <SprintProgress completed={65} done={12} left={8} />
            <MyTasks />

            {/* Row 2: Recent Activity */}
            <RecentActivity />

            {/* Row 3: Sprint Stats Bar */}
            <SprintStats
              timeRemaining="4 Days 12h"
              velocity={32}
              capacity={88}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FAB onClick={() => console.log("Add task clicked")} />
    </div>
  );
}