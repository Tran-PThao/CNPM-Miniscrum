import { useSidebar } from "../context/SidebarContext";

const contributors = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKL2ISrsCNns8o1KNta57CO8CEJ1XMRzuYwPe10xl4AfhRqOjlJxHphiFOnwPBbK-OvCqI01ZKDhkijPG8inIYpO1TPB5rHjd-PeKpH3xQ4qiyak89AmFlBz30ROkbEuc3foEzlUNkh-cI1AyMCumklnzqfkeKb2l0reslMgqDEm4ascvUsL8_FY-zrtroFodbBellAKHFsZf9i3wabuYYLEiW4fxYAIK6pHsYAhRS5_Qk5WnE4GMxOPE5Cu8rStLmOUaXrK7CN8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5KYjmcIxMJrebyNea1o23lYCubFaft7e-8aGxMCxCuZJEzDNnusyaOjxFZ6FH-mBN-cQzGeodLogn5bOAOeHmPYv3CKc_2LsNrc4xlrFmRUPNaQ080J-mjhpRJ15okcVzWBYf8TIYaUlMoj5L-lJanfNIzIvv9kkVTqz6n0q7p6UeIwHcHNp5opewpxti4YWftOtvKz9kqbGVbPQRmgJ-lwN2mdrgi-D7nQ3cx9kE6MnkzAAvwvG9RLg_6Z8EuZBRZ1S9JwV54oQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWUv8ag8Ox6wV7LQsCZTxFF7M6HZZckWo2lB5eRcc-oVRqQAH8sjtJfok4ucJKXF7KbqM2YsQY2ZUsY6e7SEsuOf5YHdBher7ZzL5u1tkubJeBgh_Pdrjaw1s2sCQZHJ8Rqq5UMLMzDe2TxvcKQinrid75GK_QGdmOoXV93LXse9D0m1YxL-7ZelfC1JUwFK6bu_yRFgs8I-q2yVKEehXQOgB8Z-K9URExl7dR6oWy__qW5GRfX3dcNkIyqPRLyEH2STRC1LHWYLc",
];

export default function BacklogHeader({ daysLeft = 6, contributorCount = 12 }) {
  const { toggle } = useSidebar();

  return (
    <header className="flex justify-between items-center w-full mb-8 md:mb-12 gap-4">
      {/* Left: Menu + Title + Contributors */}
      <div className="flex items-start gap-3">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 mt-1 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col">
          <h2 className="font-['Manrope'] font-bold text-2xl md:text-3xl text-on-surface tracking-tight">
            Project Backlog
          </h2>
          <div className="flex items-center mt-2 gap-4">
            <div className="flex -space-x-2">
              {contributors.map((src, i) => (
                <img
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-surface"
                  src={src}
                  alt={`contributor ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-on-surface-variant text-sm font-medium">
              {contributorCount} contributors
            </span>
          </div>
        </div>
      </div>

      {/* Right: Timer + Actions */}
      <div className="flex items-center gap-3">
        <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-sm md:text-base">timer</span>
          <span className="text-xs md:text-sm font-medium text-on-surface whitespace-nowrap">{daysLeft} days left</span>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors hidden sm:block">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}
