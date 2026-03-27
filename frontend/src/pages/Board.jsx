import MainLayout from "../components/MainLayout";
import BoardTopBar from "../components/BoardTopBar";
import KanbanColumn from "../components/KanbanColumn";
import FAB from "../components/FAB";

// ─── Data ────────────────────────────────────────────────────────────────────

const todoCards = [
  {
    id: "US-001",
    title: "Implement OAuth2 Authentication Flow for Enterprise clients",
    priority: "HIGH",
    attachments: 3,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDw_dTS3X5qAJu4OYH76Y1VaVeIN99myFj_a9PT-5vJTTMO-Et3n3e_dL64RIfbMhwZcTTmgOD-16L-wjE3b3gSSlq5l2Jek5o3018q-0d6LkQCI0qpHXW8XUXHns9grbfCbOZLhjBkg_ArdzbGX_ilSdVGFTbBi6Uwuz95ef6mWoU-ykgmqVrSDys9oaj0982C_c1iWfvYWznxONfkyU8F_C-VINO5z79pUm_gHE-AOsfJbPU_iU5wpnN4gEUUMyR4XZgv-8aJ594",
    ],
  },
  {
    id: "US-004",
    title: "Refactor global state management using Context API",
    priority: "MEDIUM",
    attachments: 1,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMRJh7ncNpSJ26_UUN6bYO4EiGQldQ3acg2PCsN1OtW4BFaK6vx2l5tF2qEnhdYCvNVpPsp3vL16BaMSNVjkPi7pYdvH9dYH7EJUuf5zulh7VWvTWQ8c2r4hfSLHmyFKFu9w84_ZBPhJEDUZIJMJJ0-fdiqPOYfrC24GaKJHdwIgDymj4zu77iEk4ii08V8VdaOn_OOAxmuZdmcF4zyYVtWVGVxN-48YDxvMoIdHhkjYwvtVDrfQ1J7vRdoCg98kn_Tn7KNR-iThM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0mYOn6iICNNvmSbUybNAlWwNDbrMdnlhGz8lEfzRWsove7mUcfh8YQSdI3PjakC5xZiIsTHcjYvZatykgOcbHt8jfw43QWodiQK2RtvYElZhuFKhaOjGoUJxkHybI2qGl3MhDyPArxCjB4TO2D7jLt3JUJQBZ7Zxz7exn633ZGQDExwi07OfYgxj51cHlvnLm0rkWEKbKG0Ap57QnEIpWgYJAgPM-jXu-58-qBxS7LkoCQJXU0EwlooeyhutSRdnQLINP3mOtigc",
    ],
  },
  {
    id: "US-007",
    title: "Update documentation for new design system tokens",
    priority: "LOW",
    attachments: 0,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBq0xrF684lYiIpirAosLrmH3HPhaUI-HwLbEpZ_p4h75na0QVtbWsiwP96RS4Li6CgLzJMoZrlXvV_Nzhe8hjK2Ql9fP4YkGB7Th5RH9kjsT9eFj0fM9acvl0skiWP4H9KQ7IjopyL-Nai04mQIGH3vzYh4R2fvLq-mLVTDnSavyh2Eux74BlJfXIumAa9JcUfZn979O7YaiNCxQpsGdWI-zwxC4ha2MPpG6dNJ_YqVH55eVe12UgZKWJZ8KO7Da04K77RbNxka8M",
    ],
  },
];

const inProgressCards = [
  {
    id: "US-003",
    title: "Design review for mobile responsive Kanban view",
    priority: "HIGH",
    attachments: 5,
    progress: 65,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAr7VHLEcm-sKam-zGcmQa5WMsmTt0lpPNI7NrroRKsZSDAv3rCL197igi2bPl8qSSSlEn0QwAdziv1pzNetcuFXyepfMHMHt-qTtdB-tfqv2NxsPaLjeVWa90KnXLRFothCua7BzEUjcs-Aq_rjxCBZeTP5Rjr0k5qqZf4dE2EUWJtdjdgSdXviyn6rS4qT8vJwp_3AQdHzX3v98rXsQ_1HI2eetlALpDRRRb60MOBK5CZ-xWSB7lB5uZuHPT3pJejfwhCNa8norw",
    ],
  },
  {
    id: "US-005",
    title: "API Integration for real-time board updates",
    priority: "MEDIUM",
    attachments: 2,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwTRMZAQhvhTKepZBY_F506dEP9EJ8OFf_2VGr84tn5H0bHltmsH3jR55LABSHaTH-AntkTsvmwjykD7xWBUD2R7jBGvH-ihatNnaxRNHquuRF2YPHr0qnbMO_kXKk6h0OBZ_VtMweyWfo0QqgLQVV5TNQHaYnQJsUDvpRi9ZzZJsnQjbdIZGrdQZDiGpLc20h7Q7kBd0Ku5i7xUQAB3w-uvusyudOGG-8hLNLkntxnM3sMUeXq2VZSPEAeUQDEk_YiVQmFs3EHNU",
    ],
  },
];

const doneCards = [
  {
    id: "US-002",
    title: "Setup project architecture and CI/CD pipelines",
    priority: "HIGH",
    attachments: 12,
    avatars: [],
  },
  {
    id: "US-006",
    title: "Initial UI Kit development with Tailwind CSS",
    priority: "MEDIUM",
    attachments: 8,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGauiFwWo5YyRyHTV-6yI40LZs7vkCDJRy8mSPhp5bXjsxhOs39ar_j-D_Xh9CV9V-Lgsuz1szsOQV3dX8WpplvjnLO6L9qKyoBja0RD3NYUhlvXa_F-wImXlplKv3BF9Fpl06Z5gp2FfMY3dB9Gck4ZhI70EN3VxJkyX0UBYtoHu5-2yM29Z_ppv01RC_DaQ-52yv4ozaI5MajW7F0VKXpgAldqq46v_EyyuLGg8oZwjUqJsCIHZHxSZjWJVnwFz9cy0yFQpR66U",
    ],
  },
  {
    id: "US-008",
    title: "Database schema modeling for Task entities",
    priority: "HIGH",
    attachments: 4,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkwWQFmQhUEpIFarljQR6LYI7B8qWJXwrOY3WmNJmzfgsNxSnEev3fWzlLeunQ4wdRLCwUQc9NtrtR6mJpWiOEzwZJwpc6kJpmwxDv2pk7bANvCBLCzD57-6G90H9baOZoLr_luxGIHdgYHDqPbU2VkUqld6BZE73a6Hp8EGL9r0CZzwhTD3p7brLrnT1qAEaK45U37rkKOaLMB3fQ0V-pyeHH1W-Qp-XqIzwWocZuJKSjxkBWtmbOzL09GjJgOtFbvogKUT-UiQY",
    ],
  },
  {
    id: "US-009",
    title: "User persona workshops and requirements gathering",
    priority: "LOW",
    attachments: 1,
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYMKHhTUbw_Aujl4nQ2RI0uDBtDf54xouvjTICdKSNpVQPZxXd2CyYpp4gR-abQaoUxGmBmVx6b8d6CULdNKRqV4XV0byn-2zb-H9ao4h9U5Qitg_K1Z8fA4MFu1GujoLZHsEZiB4RKYC6TpbPLE561zQo76PodKv4_OAISoSfO5coWdOkhO8AX7ReKnnGN49HbfQqH_KLTImZR1DaqSge4hlraUveLdhFNRHLyubkBgTKzc2U_rf8K7KiLb7FZQ7Uso3VNMRzT1k",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoytZ8ukra32GXkGSTfD2jqNwPVZyJ_EwmzXXYC9sVBBPaGPQcnRCj7TRhtwHOIPFjt91vAM27pgT-IJ4mll30dyaqko_aAl-qJi9oqEvzZ27h1loE1yRgUSxS1fgqCYIWco2248a8I4mov88erf6jmk2do53va9efy1FvRlRTDj0Vwkb8FdznNk7rAi9r-nQOBtw3eAKGM8zaB58jI4Y6vc604OMkgbbh2P3kddiNZ0PG6ZoD0-M434oC26HGJ3w8NKTrofQ-9E",
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BoardPage() {
  return (
    <MainLayout 
      activePage="Board"
      header={<BoardTopBar />}
    >
      <div className="h-full">
        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex h-full gap-4 md:gap-8 min-w-[900px] md:min-w-0 md:grid md:grid-cols-3">
            <KanbanColumn title="To Do"      variant="todo"       cards={todoCards} />
            <KanbanColumn title="In Progress" variant="inprogress" cards={inProgressCards} />
            <KanbanColumn title="Done"        variant="done"       cards={doneCards} />
          </div>
        </div>
      </div>

      {/* FAB */}
      <FAB onClick={() => console.log("Add task")} />
    </MainLayout>
  );
}
