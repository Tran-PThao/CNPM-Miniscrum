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
  points,
  avatar,
  variant = "sprint",
}) {
  const isSprint = variant === "sprint";

  return (
    <div
      className={`p-4 rounded-xl flex items-center gap-4 group transition-all border border-transparent cursor-grab active:cursor-grabbing ${
        isSprint
          ? "bg-surface-container-lowest hover:shadow-lg hover:border-outline-variant/20"
          : "bg-surface-container-low hover:bg-surface-container-high"
      }`}
    >
      {/* Drag handle */}
      <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity">
        drag_indicator
      </span>

      {/* ID */}
      <span className="text-xs font-bold text-on-surface-variant font-mono w-16">{id}</span>

      {/* Title */}
      <p className="flex-1 font-medium text-on-surface">{title}</p>

      {/* Meta */}
      <div className="flex items-center gap-4">
        {/* Priority badge */}
        <div
          className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tight border ${priorityConfig[priority]}`}
        >
          {priority}
        </div>

        {/* Story points */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            isSprint
              ? "bg-surface-container text-primary"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          {points}
        </div>

        {/* Assignee */}
        {avatar ? (
          <img className="w-8 h-8 rounded-full" src={avatar} alt="Assignee" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-outline">person_add</span>
          </div>
        )}
      </div>
    </div>
  );
}
