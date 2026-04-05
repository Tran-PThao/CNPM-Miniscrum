// frontend/src/components/ProductBacklog.jsx
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
  onSelectAll,
  projectId
}) {
  const isManagement = userRole === "PO" || userRole === "SM";

  const { setNodeRef } = useDroppable({
    id: "backlog-droppable-area",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==================== US-051: Server-side Pagination ====================
  const [serverStories, setServerStories] = useState([]);
  const [serverPagination, setServerPagination] = useState({
    page: 1,
    size: 12,
    totalElements: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [allServerTags, setAllServerTags] = useState([]);

  // State nội bộ cho server mode
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [internalFilterPriority, setInternalFilterPriority] = useState(filterPriority);
  const [internalFilterStatus, setInternalFilterStatus] = useState(filterStatus);
  const [internalFilterTag, setInternalFilterTag] = useState(filterTag);

  // Fetch từ API
  const fetchServerBacklog = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const params = {
        projectId,
        page: serverPagination.page,
        size: 12,
        search: internalSearchTerm || undefined,
        priority: internalFilterPriority !== "ALL" ? internalFilterPriority : undefined,
        status: internalFilterStatus !== "ALL" ? internalFilterStatus : undefined,
        tag: internalFilterTag !== "ALL" ? internalFilterTag : undefined,
      };

      console.log("Đang gọi API với params:", params);

      const res = await api.get('/user-stories/backlog', { params });

      console.log("API trả về:", res.data);

      setServerStories(res.data.content || []);
      setServerPagination({
        page: res.data.pagination.page || 1,
        size: res.data.pagination.size || 12,
        totalElements: res.data.pagination.totalElements || 0,
        totalPages: res.data.pagination.totalPages || 1,
      });

      if (res.data.allTags) setAllServerTags(res.data.allTags);
    } catch (error) {
      console.error("Lỗi load Product Backlog:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi projectId hoặc các filter thay đổi
  useEffect(() => {
    if (projectId) {
      fetchServerBacklog();
    }
  }, [projectId, serverPagination.page, internalSearchTerm, internalFilterPriority, internalFilterStatus, internalFilterTag]);

  // Reset về trang 1 khi thay đổi filter/search
  const resetToFirstPage = () => {
    setServerPagination(prev => ({ ...prev, page: 1 }));
  };

  // ==================== Logic cũ giữ nguyên ====================
  useEffect(() => {
    setCurrentPage(1);
  }, [stories.length]);

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

  const useServerMode = !!projectId;
  const displayStories = useServerMode ? serverStories : currentStories;
  const displayTotalPages = useServerMode ? serverPagination.totalPages : totalPages;
  const displayTotalItems = useServerMode ? serverPagination.totalElements : stories.length;
  const displayAllTags = useServerMode ? allServerTags : allTags;

  return (
    <section>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3 shrink-0">
          {onSelectAll && (
            <input 
              type="checkbox"
              className="w-4 h-4 cursor-pointer accent-primary shrink-0"
              checked={displayStories.length > 0 && selectedStories.length === displayStories.length}
              onChange={(e) => onSelectAll(e.target.checked, displayStories)}
            />
          )}
          <h3 className="font-['Manrope'] font-bold text-lg text-on-surface">
            Product Backlog <span className="text-on-surface-variant text-sm font-medium">({displayTotalItems} items)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
          {/* Search */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc mô tả..."
              className="pl-9 pr-3 py-2 w-full bg-surface-container-lowest rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              value={useServerMode ? internalSearchTerm : searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                if (useServerMode) {
                  setInternalSearchTerm(value);
                  resetToFirstPage();
                } else if (onSearchChange) {
                  onSearchChange(value);
                }
              }}
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-xl">search</span>
          </div>

          {/* Filter Priority */}
          <select 
            value={useServerMode ? internalFilterPriority : filterPriority}
            onChange={(e) => {
              const value = e.target.value;
              if (useServerMode) {
                setInternalFilterPriority(value);
                resetToFirstPage();
              } else if (onFilterPriorityChange) {
                onFilterPriorityChange(value);
              }
            }}
            className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none cursor-pointer w-32 text-sm"
          >
            <option value="ALL">Tất cả ưu tiên</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Filter Status */}
          <select 
            value={useServerMode ? internalFilterStatus : filterStatus}
            onChange={(e) => {
              const value = e.target.value;
              if (useServerMode) {
                setInternalFilterStatus(value);
                resetToFirstPage();
              } else if (onFilterStatusChange) {
                onFilterStatusChange(value);
              }
            }}
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
            value={useServerMode ? internalFilterTag : filterTag}
            onChange={(e) => {
              const value = e.target.value;
              if (useServerMode) {
                setInternalFilterTag(value);
                resetToFirstPage();
              } else if (onFilterTagChange) {
                onFilterTagChange(value);
              }
            }}
            className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30 focus:border-primary outline-none cursor-pointer w-32 text-sm"
          >
            <option value="ALL">Tất cả nhãn</option>
            {displayAllTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Khu vực kéo thả */}
      <div 
        ref={setNodeRef} 
        className="min-h-[400px] p-3 border-2 border-dashed border-transparent hover:border-primary/30 rounded-3xl transition-all"
      >
        <SortableContext 
          items={displayStories.map((story) => story.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {loading ? (
              <div className="py-12 text-center text-on-surface-variant/70">Đang tải dữ liệu từ server...</div>
            ) : displayStories.length > 0 ? (
              displayStories.map((story) => (
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
                  onAddTask={onAddTask}
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

      {/* Phân trang */}
      {(displayTotalPages > 1 || totalPages > 1) && (
        <div className="flex items-center justify-center gap-2 mt-4 mb-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 px-3 rounded-lg border border-outline-variant/30 text-sm font-medium hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Trang trước
          </button>
          <span className="text-sm text-on-surface-variant font-medium px-2">
            Trang {currentPage} / {displayTotalPages || totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(displayTotalPages || totalPages, p + 1))}
            disabled={currentPage === (displayTotalPages || totalPages)}
            className="p-1 px-3 rounded-lg border border-outline-variant/30 text-sm font-medium hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Nút thêm */}
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