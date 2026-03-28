import KanbanCard from "./KanbanCard";

const columnConfig = {
  todo: {
    badgeBg: "bg-surface-container-high text-on-surface-variant",
  },
  inprogress: {
    badgeBg: "bg-primary text-white",
  },
  done: {
    badgeBg: "bg-surface-dim text-on-surface-variant",
  },
};

/**
 * @param {Object}   props
 * @param {string}   props.title       - "TO DO" | "IN PROGRESS" | "DONE"
 * @param {"todo"|"inprogress"|"done"} props.variant
 * @param {Array}    props.cards       - array of KanbanCard props
 */
export default function KanbanColumn({ title, variant = "todo", cards = [], onStatusUpdate, onAssign, onEdit, onDelete, userRole }) {
  const cfg = columnConfig[variant];

  return (
    <div className="flex-1 flex flex-col min-w-[320px] bg-surface-container-low rounded-2xl p-4">
      {/* Column header */}
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-extrabold text-on-surface text-base uppercase tracking-wider">
            {title}
          </h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.badgeBg}`}>
            {cards.length}
          </span>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Cards */}
      <div className={`flex flex-col gap-4 overflow-y-auto ${variant === "done" ? "opacity-80" : ""}`}>
        {cards.map((card) => (
          <KanbanCard 
            key={card.id} 
            {...card} 
            done={variant === "done"} 
            onStatusUpdate={(newStatus) => onStatusUpdate(card.id, newStatus)} 
            onAssign={onAssign} 
            onEdit={onEdit}
            onDelete={onDelete}
            userRole={userRole}
          />
        ))}
      </div>
    </div>
  );
}
