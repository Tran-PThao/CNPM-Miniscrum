import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
  title,
  status,
  items = [],
  sprintId,
  onUpdateItem,
  itemType = 'story', // 'story' or 'task'
  columnId,           // Optional custom ID for swimlanes
  onAssign,
  onEdit,
  onDelete,
  userRole = 'MEMBER',
  members = []
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId || `column-${status}`,
  });

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

      {/* Vùng sortable */}
      <SortableContext
        items={items.map(item => itemType === 'task' ? `task-${item.id}` : item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 flex-1">
          {items.map((item) => (
            itemType === 'story' ? (
              <SortableUserStoryCard
                key={item.id}
                id={item.id}
                {...item}
                variant="sprint"
                userRole={userRole}
                onAssign={onAssign}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onUpdateItem}
              />
            ) : (
              <TaskCard
                key={item.id}
                {...item}
                id={`task-${item.id}`}
                members={members}
                onUpdate={(data) => onUpdateItem(item.id, data)}
                onDelete={() => {}}
              />
            )
          ))}

          {items.length === 0 && (
            <div className="h-16 flex items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl text-on-surface-variant/50 text-[10px] italic">
              Trống
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
