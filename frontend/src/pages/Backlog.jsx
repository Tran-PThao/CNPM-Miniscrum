import MainLayout from "../components/MainLayout";
import BacklogHeader from "../components/BacklogHeader";
import SprintSection from "../components/SprintSection";
import ProductBacklog from "../components/ProductBacklog";

export default function Backlog() {
  return (
    <MainLayout 
      activePage="Backlog"
      header={<BacklogHeader />}
    >
      <div className="space-y-6 md:space-y-10">
        {/* Active Sprint */}
        <SprintSection progress={66} />

        {/* Product Backlog */}
        <ProductBacklog onAddStory={() => console.log("Add story")} />
      </div>

      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50">
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
        </button>
      </div>
    </MainLayout>
  );
}
