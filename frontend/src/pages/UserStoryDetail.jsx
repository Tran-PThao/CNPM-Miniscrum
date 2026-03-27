import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StoryContent from "../components/StoryContent";
import StoryMetaSidebar from "../components/StoryMetaSidebar";

export default function UserStoryDetail() {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);

  return (
    <div className="flex overflow-hidden h-screen bg-surface font-['Inter'] text-on-surface antialiased">
      {/* Sidebar */}
      <Sidebar activePage="Dashboard" />

      {/* Blurred board background */}
      <main className="ml-64 flex-1 p-8 min-h-screen bg-surface relative">
        {/* Sprint Backlog header (blurred bg) */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-['Manrope'] font-bold text-3xl tracking-tight text-on-surface">
              Sprint Backlog
            </h2>
            <div className="flex items-center mt-2 gap-4">
              <span className="text-sm font-medium text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                Sprint 1
              </span>
              <span className="text-xs text-outline">Feb 14 – Feb 28</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">timer</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <img
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDohk8y9ObcWjPpP8YVkeU93LAN5GG5O4MvLIvkjNSFfjX77b_ciAcFxn4CwjDNoTzofoDswJLouaU2AaeCXJsWBvlT8KYXx-caSGWvOPXsyKe2gB0b0PWlJzU5W75RJZ-7BqE6w5qHevV_TTNw0KnSitSS_YfuqK_fWkRRuIqjwGl5ytuiFRYJ7d7DO-doYDzrFr2_nRxxhvnGk_3BNi9KrO7hTvny_HMVQ3XehAXzlwkD-Hq52r3EdSru44XCuEXKjk54MdGZn8Q"
            />
          </div>
        </header>

        {/* Dummy skeleton columns (blurred) */}
        <div className="grid grid-cols-3 gap-8 opacity-40 blur-[2px] pointer-events-none">
          {[3, 2, 2].map((count, col) => (
            <div key={col} className="space-y-4">
              <div className="h-4 w-24 bg-surface-container-highest rounded" />
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-40 bg-surface-container-lowest rounded-xl shadow-sm" />
              ))}
            </div>
          ))}
        </div>

        {/* Modal backdrop + modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-on-surface/20 backdrop-blur-sm">
          {/* Modal panel */}
          <div className="bg-white/80 backdrop-blur-xl w-full max-w-5xl h-full max-h-[850px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/15">
            {/* Left: story content */}
            <StoryContent storyId="MS-102" onClose={handleClose} />

            {/* Right: meta sidebar */}
            <StoryMetaSidebar
              status="In Progress"
              assignee="Alex"
              storyPoints={8}
              priority="High"
              created="Feb 14, 2024 · 09:12 AM"
              updated="10 mins ago"
              sprintProgress={65}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
