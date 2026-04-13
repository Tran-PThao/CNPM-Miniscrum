import { useDroppable } from '@dnd-kit/core';
import UserStoryCard from "./UserStoryCard";

export default function SprintSection({ sprint, stories = [], onMoveToBacklog, onAssign, onEdit, onDelete, onStatusChange, onStartClick, userRole, selectedStories = [], onToggleSelect, onSelectAll, onAddTask }) {
  const isManagement = userRole === "PO" || userRole === "SM";
  const { setNodeRef, isOver } = useDroppable({
    id: `sprint-${sprint.id}`,
  });

  const progress = stories.length > 0 
    ? Math.round((stories.filter(s => s.status === 'DONE').length / stories.length) * 100) 
    : 0;

  const handleStartSprint = () => {
    if (onStartClick) {
      onStartClick(sprint, stories);
    } else {
      if (window.confirm(`Bạn có chắc muốn bắt đầu ${sprint.name}?`)) {
        onStatusChange(sprint.id, 'ACTIVE');
      }
    }
  };

  const handleCompleteSprint = () => {
    if (window.confirm(`Bạn có chắc muốn kết thúc ${sprint.name}?`)) {
      onStatusChange(sprint.id, 'COMPLETED');
    }
  };

  return (
    <section className="mb-8 last:mb-0 transition-all duration-300">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onSelectAll && (
            <input 
              type="checkbox"
              className="w-5 h-5 cursor-pointer accent-primary shrink-0"
              checked={stories.length > 0 && stories.every(s => selectedStories.includes(s.id))}
              onChange={(e) => onSelectAll(e.target.checked, stories)}
              title="Chọn tất cả trong Sprint"
            />
          )}
          <h3 className="font-['Manrope'] font-bold text-lg text-on-surface">{sprint.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest ${
            sprint.status === 'ACTIVE' 
              ? 'bg-primary-container text-on-primary-container shadow-sm shadow-primary/20' 
              : sprint.status === 'COMPLETED'
              ? 'bg-surface-variant text-on-surface-variant opacity-60'
              : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            {sprint.status}
          </span>
          {sprint.startDate && (
            <span className="text-xs text-on-surface-variant opacity-60">
              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {sprint.goal && (
          <p className="text-xs text-on-surface-variant italic mb-2 px-2 mt-1 border-l-2 border-primary/20">
            Mục tiêu: {sprint.goal}
          </p>
        )}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Progress
            </span>
            <div className="w-32 h-1.5 bg-surface-container-highest rounded-full mt-1 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  sprint.status === 'COMPLETED' ? 'bg-outline' : 'bg-gradient-to-r from-primary to-primary-container'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {isManagement && (
            <>
              {sprint.status === 'PLANNED' && userRole === 'SM' && (
                <button 
                  onClick={handleStartSprint}
                  className="px-4 py-1.5 bg-primary text-on-primary text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-md shadow-primary/20 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  Start Sprint
                </button>
              )}
              {sprint.status === 'ACTIVE' && (
                <button 
                  onClick={handleCompleteSprint}
                  className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity border border-primary/20 px-3 py-1.5 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Complete Sprint
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Story cards with Droppable Area */}
      <div 
        ref={setNodeRef}
        className={`space-y-3 p-4 rounded-3xl min-h-[100px] border-2 transition-all duration-300 ${
          isOver 
            ? 'bg-primary/5 border-primary border-dashed shadow-inner scale-[1.01]' 
            : 'bg-surface-container-low border-outline-variant/10'
        }`}
      >
        {stories.length > 0 ? (
          stories.map((story) => (
            <UserStoryCard 
              key={story.id} 
              {...story} 
              variant="sprint" 
              onMove={onMoveToBacklog}
              onAssign={onAssign}
              onEdit={onEdit}
              onDelete={onDelete}
              userRole={userRole}
              moveIcon="arrow_downward"
              moveTitle="Đẩy về Backlog"
              isSelected={selectedStories.includes(story.id)}
              onToggleSelect={onToggleSelect}
              onAddTask={onAddTask}
            />
          ))
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-on-surface-variant/40 border-2 border-dashed border-outline-variant/10 rounded-2xl italic text-xs">
             <span className="material-symbols-outlined text-3xl mb-1 opacity-20">inventory_2</span>
             {isOver ? "Thả tại đây để thêm vào Sprint" : "Chưa có Story nào trong Sprint này."}
          </div>
        )}
      </div>
    </section>
  );
}

