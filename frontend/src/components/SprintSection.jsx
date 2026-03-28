import UserStoryCard from "./UserStoryCard";

export default function SprintSection({ stories = [], progress = 0, onMoveToBacklog, onAssign, onEdit, onDelete, userRole }) {
  const isManagement = userRole === "PO" || userRole === "SM";

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Sprint hiện tại</h3>
          <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">
            Active
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Progress
            </span>
            <div className="w-48 h-1.5 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {isManagement && (
            <button className="text-primary text-sm font-black uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity">
              Complete Sprint
            </button>
          )}
        </div>
      </div>

      {/* Story cards */}
      <div className="space-y-3 bg-surface-container-low p-6 rounded-3xl min-h-[100px] border border-outline-variant/5">
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
            />
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-on-surface-variant/40 border-2 border-dashed border-outline-variant/10 rounded-2xl italic text-sm">
             <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
             Chưa có Story nào trong Sprint này.
          </div>
        )}
      </div>
    </section>
  );
}
