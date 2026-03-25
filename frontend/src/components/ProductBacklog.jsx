import UserStoryCard from "./UserStoryCard";

const backlogStories = [
  {
    id: "US-004",
    title: "Add comprehensive dark mode support across dashboard",
    priority: "Medium",
    points: 5,
    avatar: null,
  },
  {
    id: "US-005",
    title: "Integrate Stripe API for monthly subscription billing",
    priority: "High",
    points: 13,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIlOUH7XUVIaHoiUpgf3vDP7o1wqbaKucvfdwHTimhV7l71TJTrDXdRQM3VUl3XdImueUQuE7V2nB7Xt7ADuBfZRO8ljw1SQswWqETDV5AzjbMFN7AfCreGdKOb6WheVCEzUo9F51Ikwv3KroSgZO3_NRSwbiu3TqnnkF4xJaI3Cy_VeFsIZtm1L1w2tVHb12xto-F5GJ0JLfzVm9vGisUPmCNKYfl4vfyWfWzINIUHPtqCuO569f68q-tiThSUHGCb9Z1AzKnILs",
  },
  {
    id: "US-006",
    title: "Update documentation for component library v2.1",
    priority: "Low",
    points: 2,
    avatar: null,
  },
  {
    id: "US-007",
    title: "Audit accessibility for screen reader compatibility",
    priority: "Medium",
    points: 8,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpkAnKWhRddNOcgAeUCvKqFRxojOHG2PunUlsWnfdeFrisKLMHISd_9dGSGflCZ1iB3Dxga7B76_5pE-mNMi8KLcg2d1ihKrf-U_aq2cV4fkXG3bteQMNs3mGCjn7KswEbyVhG1vsgcaeexnm4cqpodKViQ-3PbakZhSDN85VA_TlqGhJqKJ75KkUjurdinVncgORRp0O53oUTsy2nWEkjVBsQVSeNOLGJc4KO7zatq4rnrKuA2r5rPdiZg2sfpREWXs8cVokTffI",
  },
];

export default function ProductBacklog({ onAddStory }) {
  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-['Manrope'] font-bold text-xl text-on-surface">Product Backlog</h3>
          <span className="text-on-surface-variant text-sm font-medium">
            ({backlogStories.length} items)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-surface-container-high text-on-surface p-2 rounded-lg hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
          </button>
          <button className="bg-surface-container-high text-on-surface p-2 rounded-lg hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
        </div>
      </div>

      {/* Story cards */}
      <div className="space-y-3">
        {backlogStories.map((story) => (
          <UserStoryCard key={story.id} {...story} variant="backlog" />
        ))}

        {/* Add story placeholder */}
        <div
          onClick={onAddStory}
          className="border-2 border-dashed border-outline-variant/30 p-4 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-medium text-sm">Add story to backlog</span>
        </div>
      </div>
    </section>
  );
}
