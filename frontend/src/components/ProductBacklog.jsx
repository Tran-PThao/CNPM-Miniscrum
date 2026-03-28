import UserStoryCard from "./UserStoryCard";

export default function ProductBacklog({ stories = [], onAddStory, onAssignStory, onEdit, onDelete, onMoveToSprint, userRole }) {
  const isManagement = userRole === "PO" || userRole === "SM";

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Product Backlog</h3>
          <span className="text-on-surface-variant text-sm font-medium">
            ({stories.length} items)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-surface-container-high text-on-surface p-2 rounded-lg hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
          </button>
          <button className="bg-surface-container-high text-on-surface p-2 rounded-lg hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
        </div>
      </div>
 
      <div className="space-y-3">
        {stories.length > 0 ? (
          stories.map((story) => (
            <UserStoryCard 
              key={story.id} 
              {...story} 
              variant="backlog" 
              onAssign={onAssignStory} 
              onEdit={onEdit}
              onDelete={onDelete}
              userRole={userRole} 
              onMove={onMoveToSprint}
              moveIcon="arrow_upward"
              moveTitle="Đưa vào Sprint"
            />
          ))
        ) : (
          <div className="py-8 text-center text-on-surface-variant/30 italic text-sm border-2 border-dashed border-outline-variant/5 rounded-2xl">
            Product Backlog đang trống.
          </div>
        )}
 
        {/* Add story placeholder - Chỉ hiện cho PO/SM */}
        {isManagement && (
          <div
            onClick={onAddStory}
            className="border-2 border-dashed border-outline-variant/10 p-4 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant/40 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
            <span className="font-bold text-sm">Thêm yêu cầu mới vào Backlog</span>
          </div>
        )}
      </div>
    </section>
  );
}
