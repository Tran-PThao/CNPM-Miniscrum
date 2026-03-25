import Sidebar from "../components/Sidebar";
import BacklogHeader from "../components/BacklogHeader";
import SprintSection from "../components/SprintSection";
import ProductBacklog from "../components/ProductBacklog";

export default function Backlog() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Left Sidebar – Backlog is active */}
      <Sidebar activePage="Backlog" />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8 lg:p-12 flex-1">
        {/* Header */}
        <BacklogHeader daysLeft={6} contributorCount={12} />

        {/* Active Sprint */}
        <SprintSection progress={66} />

        {/* Product Backlog */}
        <ProductBacklog onAddStory={() => console.log("Add story")} />
      </main>

      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50">
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
        </button>
      </div>
    </div>
  );
}