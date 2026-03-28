const priorityConfig = {
  High: "bg-error-container text-on-error-container border-error/10",
  Medium: "bg-tertiary-container text-on-tertiary-container border-tertiary/10",
  Low: "bg-secondary-fixed-dim text-on-secondary-fixed-variant border-secondary/10",
};

/**
 * @param {Object} props
 * @param {string} props.id         - e.g. "US-001"
 * @param {string} props.title      - story title
 * @param {"High"|"Medium"|"Low"} props.priority
 * @param {number} props.points     - story points
 * @param {string} [props.avatar]   - assignee avatar URL
 * @param {"sprint"|"backlog"} [props.variant] - card style
 */
export default function UserStoryCard({
  id,
  title,
  priority,
  description,
  storyPoints,
  assignee,
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

  return (
    <div
      className={`p-4 rounded-xl flex items-center gap-4 group transition-all border border-transparent cursor-grab active:cursor-grabbing ${
        isSprint
          ? "bg-surface-container-lowest hover:shadow-lg hover:border-outline-variant/20"
          : "bg-surface-container-low hover:bg-surface-container-high"
      }`}
    >
      {/* Move icon for Management */}
      {isManagement && onMove && (
        <button 
          onClick={(e) => { e.stopPropagation(); onMove(id); }}
          className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all opacity-0 group-hover:opacity-100"
          title={moveTitle}
        >
          <span className="material-symbols-outlined text-lg font-black">{moveIcon}</span>
        </button>
      )}

      {!isManagement && (
        <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity">
          drag_indicator
        </span>
      )}

      {/* ID */}
      <span className="text-[10px] font-black text-on-surface-variant font-mono w-16 truncate bg-surface-container px-2 py-0.5 rounded uppercase tracking-tighter" title={id}>
        {id?.slice(-6) || "NEW"}
      </span>

      {/* Title */}
      <p className="flex-1 font-bold text-on-surface text-sm truncate">{title}</p>

      {/* Meta */}
      <div className="flex items-center gap-4">
        {/* Priority badge */}
        <div
          className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border ${priorityConfig[priority] || priorityConfig.Medium}`}
        >
          {priority}
        </div>

        {/* Story points */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
            isSprint
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
          title="Story Points"
        >
          {storyPoints || 0}
        </div>

        {/* Management Actions: Edit/Delete */}
        {isManagement && (
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.({ id, title, description, priority, storyPoints, assignee }); }}
              className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all opacity-0 group-hover:opacity-100"
              title="Sửa Story"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
              className="p-1.5 hover:bg-error/10 rounded-lg text-error transition-all opacity-0 group-hover:opacity-100"
              title="Xóa Story"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}

        {/* Assignee */}
        {assignee?.fullName ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-[10px] shadow-sm" title={assignee.fullName}>
            {assignee.fullName.charAt(0).toUpperCase()}
          </div>
        ) : isManagement ? (
          <button onClick={(e) => { e.stopPropagation(); onAssign?.(id); }} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-outline border border-dashed border-outline-variant/30" title="Gán thành viên">
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
