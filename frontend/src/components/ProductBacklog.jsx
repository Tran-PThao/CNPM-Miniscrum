import { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableUserStoryCard } from "./SortableUserStoryCard";
import api from '../services/api';

export default function ProductBacklog({
  stories = [],
  searchTerm = "",
  onSearchChange,
  filterPriority = "ALL",
  onFilterPriorityChange,
  filterStatus = "ALL",
  onFilterStatusChange,
  filterTag = "ALL",
  onFilterTagChange,
  onAddStory,
  onAssignStory,
  onEdit,
  onDelete,
  onMoveToSprint,
  userRole,
  selectedStories = [],
  onToggleSelect,
  onSelectAll
}) {
  const isManagement = userRole === "PO" || userRole === "SM";

  const { setNodeRef } = useDroppable({
    id: "backlog-droppable-area",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 anytime the underlying list (length) or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [stories.length, searchTerm, filterPriority, filterStatus, filterTag]);

  // Lấy tất cả tag duy nhất từ stories (Filter Tag động)
  const allTags = [...new Set(
    stories.flatMap(story => {
      if (!story.tags) return [];
      const tagsArray = Array.isArray(story.tags) 
        ? story.tags 
        : JSON.parse(story.tags || '[]');
      return tagsArray;
    })
  )].sort();

  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const currentStories = stories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {onSelectAll && (
            <input 
              type="checkbox"
              className="w-5 h-5 cursor-pointer accent-primary shrink-0"
              checked={stories.length > 0 && selectedStories.length === stories.length}
              onChange={(e) => onSelectAll(e.target.checked, stories)}
              title="Chọn tất cả trong Backlog"
            />
          )}
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Product Backlog</h3>
          <span className="text-on-surface-variant text-sm font-medium">
            ({stories.length} items)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
          
          {/* Search */}
          <div className="relative w-64 shrink-0">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc mô tả..."
              className="pl-9 pr-3 py-2 w-full bg-surface-container-lowest rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-lg">search</span>
          </div>

          {/* Filter Priority */}
          <select 
            value={filterPriority}
            onChange={(e) => onFilterPriorityChange(e.target.value)}
            className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none cursor-pointer w-32 text-sm"
          >
            <option value="ALL">Tất cả ưu tiên</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Filter Status */}
          <select 
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none cursor-pointer w-36 text-sm"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          {/* Filter Tag */}
          <select 
            value={filterTag}
            onChange={(e) => onFilterTagChange(e.target.value)}
            className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none cursor-pointer w-32 text-sm"
          >
            <option value="ALL">Tất cả nhãn</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Khu vực kéo thả */}
      <div 
        ref={setNodeRef} 
        className="min-h-[350px] border border-dashed border-outline-variant/40 rounded-2xl overflow-hidden transition-all bg-surface"
      >
        <SortableContext 
          items={currentStories.map((story) => story.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {currentStories.length > 0 ? (
              currentStories.map((story) => (
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
                  isSelected={selectedStories.includes(story.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))
            ) : (
              <div className="py-12 text-center text-on-surface-variant/50 italic border border-dashed border-outline-variant/20 rounded-xl text-sm">
                Product Backlog đang trống.
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      {/* Phân trang (Pagination) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 mb-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 px-3 rounded-lg border border-outline-variant/30 text-sm font-medium hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Trang trước
          </button>
          <span className="text-sm text-on-surface-variant font-medium px-2">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 px-3 rounded-lg border border-outline-variant/30 text-sm font-medium hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Nút thêm */}
      <div
        onClick={onAddStory}
        className="mt-6 border border-dashed border-outline-variant/30 p-3 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant/60 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all cursor-pointer group bg-surface-container-lowest"
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform text-xl">add_circle</span>
        <span className="font-bold text-sm">Thêm User Story mới vào Backlog</span>
      </div>
    </section>
  );
}