export default function TopBar() {
  return (
    <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 bg-[#f8f9fb]/80 backdrop-blur-xl z-30">
      {/* Search */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-64 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors">
          <span className="material-symbols-outlined">timer</span>
        </button>

        <button className="p-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <button className="p-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>

        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>

        <img
          alt="User profile avatar"
          className="w-8 h-8 rounded-full border-2 border-surface-container-high object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNZvKLiEEanzqyl9pZjr24DAp1rhofPp91TaE2p8pPK9p-Bm0i8hmM8zXktpEHurICsjo5PcI7RpQe1E_WRBKMOstTUquoH2tSHTHkUS39OsuxmfnTMrzZDwYxNQr4o6TduCEvZqP16xTzawrlfqXkmhlPC1Ndn-VkmENSGaOZ2MA09-L-JC3yZoCP7Eo782k3TqzUB28hX3scS3Nz3ORZQHnEMHEAn6TpTDOWKtwL7lwjXBUWtBO1AZzJW69wsSfBQll3hr-fsrA"
        />
      </div>
    </header>
  );
}
