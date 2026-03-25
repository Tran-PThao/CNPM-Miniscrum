import UserStoryCard from "./UserStoryCard";

const sprintStories = [
  {
    id: "US-001",
    title: "Implement OAuth2 authentication for enterprise SSO",
    priority: "High",
    points: 8,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4tkt2s-VmYZ9fVneMpeC2o4IT4GnXRLM2AQYjzhF5F7eoTZAzyN2hFsJQ7qsOx5tY-roETqboMjAjcI3eqvxObm_7LDglOwleWPWRIokfNcYiA2sVUf_RIFSWoLD1CaRVkVQ3XuEgoGg_tbNxlPI3G7ky4c3JQwlGKhmlWOvedM9VcV46Dpj3Plm7cC6M0b5lfadbwadeKhQ_84pk9RMvfJW3ZAuCLMBvjUzXm8fTmw1ld9T0-mPgXePYyqCnGPr9Bg_KulSiPw",
  },
  {
    id: "US-002",
    title: "Refactor global state management using Atomic patterns",
    priority: "Medium",
    points: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZu4fqWtBXmy-LPCdia4yU4yYOlway0a7k8HB1UtmZlSodpU1y9L2Nwg3KlheOzAkrrF3yPSbZVeZZITBBP2gaUWpNWlB05zZatOhPimpK9J3u0zoFSLWSr-K2F7ik2NOpB1Ak2MbCXoBhTR0GatxnFndj_RS1IAahI-HrOfZhmM4s_wtrJ7u380-7HZf3UW9j2jxhIxtSL-LnMi4SEseYoMkbqjMWsCFg8IudhYywlUXphkwjDzNjFzjuXLz815W0-hhV6ww3nzI",
  },
  {
    id: "US-003",
    title: "Optimize SVG assets and implement lazy loading",
    priority: "Low",
    points: 3,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBexoUHKvy92E4Pgb66kZ18CFR9TkW9Oq1CF-4QeK3fi31fMPOp3sjGKyb_x1Hoqi56IW8TYWx735jGuIXSWXxZ4yE51x1Npp7U6khaYUf0nW8MMK3LsClH6hRLN1eyo1q-jbOUaD7PTOQMF65gEcCyYk09v23Q_bppbHAO5F_FLnCm-QToPlTELl5DsZ0LwDX-I5UCPKHytKK4m57-bw58HW7sNayAjEB0Up80FUoCIRG2WC5VLzGXrwliK6gBLBSCVphJcgTddh8",
  },
];

export default function SprintSection({ progress = 66 }) {
  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Sprint 1 (Active)</h3>
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
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity">
            Complete Sprint
          </button>
        </div>
      </div>

      {/* Story cards */}
      <div className="space-y-3 bg-surface-container-low p-6 rounded-2xl">
        {sprintStories.map((story) => (
          <UserStoryCard key={story.id} {...story} variant="sprint" />
        ))}
      </div>
    </section>
  );
}
