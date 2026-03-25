export default function BoardTopBar({ timeRemaining = "4 days 12 hours remaining" }) {
  return (
    <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 bg-[#f8f9fb]/80 backdrop-blur-xl z-30">
      {/* Left: Timer */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant">timer</span>
          <span className="text-sm font-['Inter'] font-medium text-on-surface">{timeRemaining}</span>
        </div>
      </div>

      {/* Right: Actions + Avatar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-full font-['Manrope'] font-bold text-sm shadow-md transition-all active:scale-95 hover:opacity-90">
          Complete Sprint
        </button>

        <div className="flex items-center gap-3 ml-2 border-l border-outline-variant/30 pl-6">
          <img
            alt="User profile avatar"
            className="w-8 h-8 rounded-full bg-surface-container-high object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsTed542EyBOCekczOuZyJ1fkxfiuXYu5_PC8lnGHH4zOPxa0vrEwR3moZpG11kRuCfVFi0KjdX8BHCVEY9SzyHNQx8HH5s-RckBvpNTk5e28vdXjcWkd_LSSFFZRqTa6GC2t7ZpMENRNKzB0TTJ0Fz9fBB1fuT8o0pSPwBjJ_0MZ3qL-pa7czTixU6iRv9f5wWn1yjJd9aBkkCjj3UPkp7Na-HpGYBCnN7gHwYdr4BpkoPRQEMsk47chMTYVcomH6vsC5VEHWOHw"
          />
        </div>
      </div>
    </header>
  );
}
