import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableUserStoryCard } from "./SortableUserStoryCard";

export default function ProductBacklog({
  stories = [],
  searchTerm = "",
  onSearchChange,
  filterPriority = "ALL",
  onFilterPriorityChange,
  onAddStory,
  onAssignStory,
  onEdit,
  onDelete,
  onMoveToSprint,
  userRole
}) {
  const isManagement = userRole === "PO" || userRole === "SM";

  const { setNodeRef } = useDroppable({
    id: "backlog-droppable-area",
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Product Backlog</h3>
          <span className="text-on-surface-variant text-sm font-medium">
            ({stories.length} items)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc mô tả..."
              className="pl-10 pr-4 py-2.5 w-full bg-surface-container-high rounded-xl border border-outline-variant focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-xl">search</span>
          </div>

          <select 
            value={filterPriority}
            onChange={(e) => onFilterPriorityChange(e.target.value)}
            className="bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả ưu tiên</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Khu vực kéo thả - quan trọng */}
      <div 
        ref={setNodeRef} 
        className="min-h-[400px] p-3 border-2 border-dashed border-transparent hover:border-primary/30 rounded-3xl transition-all"
      >
        <SortableContext 
          items={stories.map((story) => story.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {stories.length > 0 ? (
              stories.map((story) => (
                <SortableUserStoryCard
                  key={story.id}
                  id={story.id}
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
              <div className="py-16 text-center text-on-surface-variant/50 italic border border-dashed border-outline-variant/20 rounded-2xl">
                Product Backlog đang trống.
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      {isManagement && (
        <div
          onClick={onAddStory}
          className="mt-6 border-2 border-dashed border-outline-variant/30 p-6 rounded-2xl flex items-center justify-center gap-3 text-on-surface-variant/60 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all cursor-pointer group"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform text-2xl">add_circle</span>
          <span className="font-bold">Thêm User Story mới vào Backlog</span>
        </div>
      )}
    </section>
  );
}