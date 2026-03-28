const priorityConfig = {
  High: {
    badge: "bg-error-container text-on-error-container border-error/10",
    bar: "bg-primary opacity-20",
  },
  Medium: {
    badge: "bg-tertiary-container text-on-tertiary-container border-tertiary/10",
    bar: "bg-tertiary-container opacity-40",
  },
  Low: {
    badge: "bg-secondary-fixed-dim text-on-secondary-fixed-variant border-secondary/10",
    bar: "bg-secondary-fixed-dim",
  },
};

const tasks = [
  {
    id: 1,
    title: "UI Design for Dashboard",
    priority: "High",
    attachments: 3,
    comments: 2,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPISsDkor4ctT5302dJu_2cpkTHWk_VZj4LsZqFZWHe619_hQur0dec6OVxBP6UKRUePptRsKXY0UTY183a1cpSzPmFzrKTXGu9rMgO8GK9KYN195UVLAOaHRs6rNCuqHgBEak2YgAS0d4smIeIgbgd5xliU5zjXzCWH_58uUXImIspOZ24pNbiIfP1hnzhU0nYwzm9UwcTNdlOno07jVSG56r6btS5JPSII_rCeiLtS14uXB5utbokQcgHwk5G_Q4Y_z0K7wTTcY",
  },
  {
    id: 2,
    title: "Refactor API",
    priority: "Medium",
    attachments: 1,
    comments: null,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuABTeJ1SytGJ3Q3Cd3t1-4d08PH5xSRAmqs2ZFZHiKsIVsY8PcxUF9GFzVjRda15U1VEBYQumKC_ppu5V19gyKvTLV__WGhKYKeGRX8IkbgvB5gS7NClo5apBAe3PRHg_4ap9scfmYjR9GqNpKCa6MB2DcQm7CT27ksJLyoN_4uJ41-V0zDoJky6g82Rt0PYPIOSZ9C0YndZad40wuaFRyuCowd2S23ZNdl7Vc1BBl-4gXaIdGuZV46abGpAHOcGUxJHGR-m1I_MGA",
  },
  {
    id: 3,
    title: "Write Unit Tests",
    priority: "Low",
    dueToday: true,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUkT0YysmEoOIUxCBWp6eXNswTVUKp26qYwpY4vvEngtWU25Y6Fo8speWRGlt8qrMDqN1hSb2PM_UQ8GS7Rt765xERHD-fdL7aHZmFGSTVYRpuf3uCtAS9GMV80FTDlaU1Vgf1dEgnUZe3MUjIHAXVvrIaPQrPRiqB1n3YM_EPaNq3zD_bCBqrrCbINOqQ3BJfbrdaVZ26SEK14xm5UnNaqT_EzJxJVgi3n0jtuYkfkG6gIjH6a5XJQD46baXunMvwlcgQUb8dnMQ",
  },
];

import { useNavigate } from "react-router-dom";

export default function MyTasks() {
  const navigate = useNavigate();
  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8">
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-['Manrope'] font-bold text-lg">My Tasks</h3>
        <button onClick={() => navigate("/board")} className="text-sm font-semibold text-primary hover:underline transition-all">View all</button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const cfg = priorityConfig[task.priority];
          return (
            <div
              key={task.id}
              className="group bg-surface-container-lowest p-5 rounded-xl transition-all hover:bg-white hover:translate-x-1 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full ${cfg.bar}`} />
                  <div>
                    <h4 className="font-semibold text-on-surface">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      {task.attachments && (
                        <span className="text-xs font-medium text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">attachment</span>
                          {task.attachments}
                        </span>
                      )}
                      {task.comments && (
                        <span className="text-xs font-medium text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">chat_bubble</span>
                          {task.comments}
                        </span>
                      )}
                      {task.dueToday && (
                        <span className="text-xs font-medium text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-[0.1rem] ${cfg.badge}`}>
                    {task.priority}
                  </span>
                  <img alt="Assignee" className="w-8 h-8 rounded-full" src={task.avatar} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
