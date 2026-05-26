const priorityConfig = {
  HIGH: "bg-error-container text-on-error-container border-error/10",
  MEDIUM: "bg-tertiary-container text-on-tertiary-container border-tertiary/10",
  LOW: "bg-secondary-fixed-dim text-on-secondary-fixed-variant border-secondary/10",
};

export default function UserStoryCard({
  id,
  title,
  priority,
  description,
  storyPoints,
  assignee,
  tags = [],                    // ← Nhận tags từ props
  variant = "sprint",
  onAssign,
  onEdit,
  onDelete,
  onMove,
  userRole,
  moveIcon = "arrow_upward",
  moveTitle = "Đưa vào Sprint"
}) {
  const isSprint = variant === "sprint";
  const isManagement = userRole === "PO" || userRole === "SM";

  // Xử lý tags (hỗ trợ cả string JSON và array)
  const tagList = Array.isArray(tags) 
    ? tags 
    : (typeof tags === 'string' ? JSON.parse(tags || '[]') : []);

  return (
    <div
      className={`p-4 rounded-xl flex flex-col gap-3 group transition-all border border-transparent cursor-grab active:cursor-grabbing ${
        isSprint
          ? "bg-surface-container-lowest hover:shadow-lg hover:border-outline-variant/20"
          : "bg-surface-container-low hover:bg-surface-container-high"
      }`}
    >
      {/* Header: ID + Title + Move Button */}
      <div className="flex items-start gap-3">
        {/* Move icon cho Management */}
        {isManagement && onMove && (
          <button 
            onClick={(e) => { e.stopPropagation(); onMove(id); }}
            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all opacity-0 group-hover:opacity-100 mt-0.5"
            title={moveTitle}
          >
            <span className="material-symbols-outlined text-lg font-black">{moveIcon}</span>
          </button>
        )}

        {!isManagement && (
          <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
            drag_indicator
          </span>
        )}

        {/* ID */}
        <span className="text-[10px] font-black text-on-surface-variant font-mono w-16 truncate bg-surface-container px-2 py-0.5 rounded uppercase tracking-tighter mt-0.5" title={id}>
          {id?.slice(-6) || "NEW"}
        </span>

        {/* Title */}
        <p className="flex-1 font-bold text-on-surface text-sm leading-tight mt-0.5">
          {title}
        </p>

        {/* Management Actions */}
        {isManagement && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.({ id, title, description, priority, storyPoints, assignee, tags }); }}
              className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all"
              title="Sửa Story"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
              className="p-1.5 hover:bg-error/10 rounded-lg text-error transition-all"
              title="Xóa Story"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-on-surface-variant/70 leading-relaxed line-clamp-2 pl-1 border-l-2 border-outline-variant/20">
          {description}
        </p>
      )}

      {/* Tags Section */}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagList.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2.5 py-0.5 text-[10px] font-medium bg-surface-container-high text-on-surface-variant rounded-md border border-outline-variant/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta: Priority, Story Points, Assignee */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <div
            className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${priorityConfig[priority] || priorityConfig.MEDIUM}`}
          >
            {priority}
          </div>

          {/* Story Points */}
          <div
            className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
              storyPoints && storyPoints > 0
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-surface-container text-on-surface-variant"
            }`}
            title="Story Points"
          >
            <span className="material-symbols-outlined text-base">star</span>
            {storyPoints || 0}
          </div>
        </div>

        {/* Assignee */}
        {assignee?.fullName ? (
          <div 
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-sm"
            title={assignee.fullName}
          >
            {assignee.fullName.charAt(0).toUpperCase()}
          </div>
        ) : isManagement ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onAssign?.(id); }}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-outline border border-dashed border-outline-variant/30"
            title="Gán thành viên"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline opacity-50 border border-outline-variant/10">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        )}
      </div>
    </div>
  );
}