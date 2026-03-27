import { useSidebar } from "../context/SidebarContext";

export default function BoardTopBar({ timeRemaining = "4 days 12 hours remaining" }) {
  const { toggle } = useSidebar();

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 bg-[#f8f9fb]/80 backdrop-blur-xl z-30 border-b border-outline-variant/10">
      {/* Left: Menu + Timer */}
      <div className="flex items-center gap-3 md:gap-8">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2 md:gap-4 bg-surface-container-low px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant text-sm md:text-base">timer</span>
          <span className="text-xs md:text-sm font-['Inter'] font-medium text-on-surface truncate max-w-[120px] md:max-w-none">{timeRemaining}</span>
        </div>
      </div>

      {/* Right: Actions + Avatar */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors hidden md:block">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 md:px-6 py-1.5 md:py-2 rounded-full font-['Manrope'] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 hover:opacity-90">
          Complete <span className="hidden sm:inline">Sprint</span>
        </button>

        <div className="flex items-center gap-3 ml-1 md:ml-2 border-l border-outline-variant/30 pl-3 md:pl-6">
          <img
            alt="User profile avatar"
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-container-high object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsTed542EyBOCekczOuZyJ1fkxfiuXYu5_PC8lnGHH4zOPxa0vrEwR3moZpG11kRuCfVFi0KjdX8BHCVEY9SzyHNQx8HH5s-RckBvpNTk5e28vdXjcWkd_LSSFFZRqTa6GC2t7ZpMENRNKzB0TTJ0Fz9fBB1fuT8o0pSPwBjJ_0MZ3qL-pa7czTixU6iRv9f5wWn1yjJd9aBkkCjj3UPkp7Na-HpGYBCnN7gHwYdr4BpkoPRQEMsk47chMTYVcomH6vsC5VEHWOHw"
          />
        </div>
      </div>
    </header>
  );
}
