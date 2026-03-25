const activities = [
  {
    id: 1,
    name: "Alex",
    action: "moved US-005 to",
    highlight: "Done",
    time: "2 hours ago",
    context: "Dashboard Revamp",
    icon: "done_all",
    iconBg: "bg-primary text-white",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXiwsRQCW28uL4PGU0EH2CPHgXqWEqxtniMGDLLPMfMxFybJSDXOGMwLliAluQr8P66WwG8EtVrlMsfbh2o-pcwjgewz05nzebwvhDzsR0Ud2eZjmqrwPZXM-D3B_e2kZioAQCticHLjE052pnXrwIWBDbOh8RO7xtKqozxZoHX6Alz5i16G4XB2k0gvRLTTqKl340Pn9dvhy8QUD-EmH3rBDS9vBC1wi1aozsY78mgTlNVNNMw66J1JU0kKISngmPXxBBu3t0jRQ",
  },
  {
    id: 2,
    name: "Sarah",
    action: "commented on",
    highlight: "US-002",
    time: "4 hours ago",
    context: '"Need clarification on the API endpoints..."',
    icon: "comment",
    iconBg: "bg-secondary-container text-on-secondary-container",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJDOTVeXxbhm0Udnr7x84w1r02DYtDnldpxDsqoSItHokMtHurlHyQMR4CT9wy46F5ABi-flpo4wM0vZKgWPt94_oU8y0HyVvjbSQlTc7CaGzY8tbyPhSc0Y9QAxFHw8xCbhoK_ioseUIy47kpY0OWwAnOWqGqGR8JvS1Nn6xISB97qko9ImvmxL2-jI2h9Kd9wudNZIL42NUW7Cnz0H2Uux1kjVkEdve81UaIqtPMk1JckzAQANNuPP-c8VWcufdAiB5Nlahh_9s",
  },
];

export default function RecentActivity() {
  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-xl p-8 ambient-shadow overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-['Manrope'] font-bold text-lg">Recent Activity</h3>
        <span className="material-symbols-outlined text-outline">history</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {activities.map((activity, idx) => (
          <>
            <div
              key={activity.id}
              className="flex-1 flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group"
            >
              <div className="relative shrink-0">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={activity.avatar}
                  alt={activity.name}
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${activity.iconBg} rounded-full flex items-center justify-center scale-90`}>
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {activity.icon}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">
                  <span className="font-bold">{activity.name}</span>{" "}
                  {activity.action}{" "}
                  <span className={idx === 0 ? "text-primary font-bold" : "font-bold text-on-surface"}>
                    {activity.highlight}
                  </span>
                </p>
                <p className="text-xs text-outline mt-1">
                  {activity.time} • {activity.context}
                </p>
              </div>
            </div>
            {idx < activities.length - 1 && (
              <div className="hidden md:block w-[1px] bg-outline-variant/30" />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
