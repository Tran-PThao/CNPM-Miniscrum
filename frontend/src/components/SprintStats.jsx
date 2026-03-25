export default function SprintStats({
  timeRemaining = "4 Days 12h",
  velocity = 32,
  capacity = 88,
}) {
  return (
    <div className="col-span-12">
      <div className="bg-gradient-to-r from-primary to-primary-container p-[1px] rounded-2xl">
        <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          {/* Left: Stats */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Time Remaining</p>
              <h4 className="text-2xl font-bold text-on-surface">{timeRemaining}</h4>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant" />
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Team Velocity</p>
              <h4 className="text-2xl font-bold text-on-surface">
                {velocity} <span className="text-sm font-normal text-outline">pts/sprint</span>
              </h4>
            </div>
          </div>

          {/* Center: Progress bar */}
          <div className="flex-1 max-w-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-on-surface-variant">Sprint Workload Capacity</p>
              <p className="text-xs font-bold text-primary">{capacity}%</p>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${capacity}%` }}
              />
            </div>
          </div>

          {/* Right: CTA */}
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
            <span>Sprint Health</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
