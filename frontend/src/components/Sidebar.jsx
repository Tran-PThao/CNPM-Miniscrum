export default function Sidebar({ activePage = "Dashboard", isOpen, onClose }) {
  const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
    { icon: "list_alt", label: "Backlog", href: "/backlog" },
    { icon: "view_kanban", label: "Board", href: "#" },
    { icon: "assessment", label: "Reports", href: "#" },
  ];

  const bottomItems = [
    { icon: "group", label: "Team" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <aside className={`flex flex-col fixed h-full py-6 pr-4 bg-[#f1f3f8] h-screen w-64 left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <div>
          <h1 className="font-['Manrope'] font-extrabold text-[#191c1e] leading-tight">Mini Scrum</h1>
          <p className="font-['Inter'] text-[10px] font-medium text-on-secondary-container opacity-70">Active Sprint 1</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
      {navItems.map(({ icon, label, href }) =>
          label === activePage ? (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-6 py-3 bg-white text-primary rounded-r-full shadow-sm font-['Inter'] text-sm font-medium transition-all"
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </a>
          ) : (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-6 py-3 text-[#44474e] hover:pl-8 hover:text-primary font-['Inter'] text-sm font-medium transition-all"
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </a>
          )
        )}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 mb-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-lg hover:scale-[0.98] transition-all">
          <span className="material-symbols-outlined">add</span>
          <span>Create Task</span>
        </button>
        <div className="space-y-1">
          {bottomItems.map(({ icon, label }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 px-6 py-2 text-[#44474e] hover:text-primary font-['Inter'] text-sm font-medium transition-all"
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
