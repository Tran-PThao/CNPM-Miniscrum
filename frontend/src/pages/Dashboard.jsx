import MainLayout from "../components/MainLayout";
import SprintProgress from "../components/SprintProgress";
import MyTasks from "../components/MyTasks";
import RecentActivity from "../components/RecentActivity";
import SprintStats from "../components/SprintStats";
import FAB from "../components/FAB";

export default function Dashboard() {
  return (
    <MainLayout activePage="Dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Welcome / Sprint Header */}
        <div className="mb-6 md:mb-10">
          <h2 className="editorial-anchor text-2xl md:text-4xl text-on-surface tracking-tight mb-2">
            Sprint 1 Overview
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base font-medium">
            Tactile Precision Dashboard • Nov 14 — Nov 28
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
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

      {/* Floating Action Button */}
      <FAB onClick={() => console.log("Add task clicked")} />
    </MainLayout>
  );
}
