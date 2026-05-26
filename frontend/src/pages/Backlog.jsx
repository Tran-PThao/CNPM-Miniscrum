import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// === Thêm thư viện Drag & Drop ===
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import MainLayout from "../components/MainLayout";
import BacklogHeader from "../components/BacklogHeader";
import SprintSection from "../components/SprintSection";
import ProductBacklog from "../components/ProductBacklog";
import api, { 
  getStoriesByProject, 
  createUserStory, 
  updateUserStory, 
  getSprintsByProject,
  reorderStories
} from "../services/api";
import CreateStoryModal from "../components/CreateStoryModal";
import CreateSprintModal from "../components/CreateSprintModal";

export default function Backlog() {
  const { projectId } = useParams();
  
  // === State cũ giữ nguyên (US-007 & US-008) ===
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [stories, setStories] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [project, setProject] = useState(null);
  const [userRole, setUserRole] = useState("MEMBER");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Cấu hình Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // kéo một khoảng mới bắt đầu
    })
  );

  // Load data
  useEffect(() => {
    if (!projectId) {
      api.get("/project").then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          navigate(`/projects/${res.data[0].id}/backlog`, { replace: true });
        } else {
          navigate("/dashboard");
        }
      }).catch(() => navigate("/login"));
      return;
    }

    setIsLoading(true);
    Promise.all([
      getStoriesByProject(projectId),
      getSprintsByProject(projectId),
      api.get(`/project/${projectId}`),
      api.get(`/project/${projectId}/role`)
    ]).then(([storiesRes, sprintsRes, projectRes, roleRes]) => {
      setStories(Array.isArray(storiesRes.data) ? storiesRes.data : []);
      setSprints(Array.isArray(sprintsRes.data) ? sprintsRes.data : []);
      setProject(projectRes.data);
      setUserRole(roleRes.data.role);
    }).catch(err => {
      console.error("Lỗi tải dữ liệu:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }).finally(() => setIsLoading(false));
  }, [projectId, navigate]);

  const loadData = async () => {
    try {
      const [storiesRes, sprintsRes] = await Promise.all([
        getStoriesByProject(projectId),
        getSprintsByProject(projectId)
      ]);
      setStories(Array.isArray(storiesRes.data) ? storiesRes.data : []);
      setSprints(Array.isArray(sprintsRes.data) ? sprintsRes.data : []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  // === Lọc stories cho Product Backlog ===
  // Stories trong backlog là những cái không có sprintId (chưa được gán vào Sprint nào)
  const backlogStories = stories.filter(s => s.sprintId === null || s.sprintId === undefined);

  const filteredBacklogStories = backlogStories
    .filter(story => 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.description && story.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(story => filterPriority === "ALL" || story.priority === filterPriority)
    .filter(story => filterStatus === "ALL" || story.status === filterStatus);

  // ====================== DRAG & DROP (US-009) ======================
  
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const activeStory = stories.find(s => s.id === activeId);
    if (!activeStory) return;

    // Xác định khu vực đích (target zone)
    let targetZone = null;
    let targetSprintId = null;

    if (overId === "backlog-droppable-area") {
      targetZone = "BACKLOG";
    } else if (overId.startsWith("sprint-")) {
      targetZone = "SPRINT";
      targetSprintId = overId.replace("sprint-", "");
    } else {
      // Đã drop lên một thẻ (card) cụ thể
      const overStory = stories.find(s => s.id === overId);
      if (overStory) {
        if (overStory.sprintId) {
           targetZone = "SPRINT";
           targetSprintId = overStory.sprintId;
        } else {
           targetZone = "BACKLOG";
        }
      }
    }

    if (!targetZone) return;

    const isCurrentlyInBacklog = activeStory.sprintId == null;

    // 1. KÉO-THẢ TRONG CÙNG PRODUCT BACKLOG (US-009)
    if (isCurrentlyInBacklog && targetZone === "BACKLOG") {
      const activeIndex = backlogStories.findIndex(s => s.id === activeId);
      
      // Xử lý nếu drop trúng thẻ nền vùng chứa thay vì card cụ thể
      let finalOverIndex = backlogStories.findIndex(s => s.id === overId);
      if (overId === "backlog-droppable-area" || finalOverIndex === -1) {
         finalOverIndex = backlogStories.length - 1; // Mặc định chuyển xuống cuối
      }
      
      if (activeIndex !== -1) {
        const newOrderedBacklog = arrayMove(backlogStories, activeIndex, finalOverIndex);
        
        // Optimistic UI
        const sprintStoriesList = stories.filter(s => s.sprintId != null);
        setStories([...sprintStoriesList, ...newOrderedBacklog]);

        try {
          const updates = newOrderedBacklog.map((story, index) => ({
            id: story.id,
            backlogOrder: index
          }));
          await reorderStories(updates);
          // KHÔNG gọi loadData() ở đây nữa để giữ nguyên Optimistic UI, tránh bị browser cache ghi đè quay ngược lại
        } catch (err) {
          console.error("Lỗi khi lưu thứ tự:", err);
          alert("Lỗi lưu thay đổi vị trí: " + (err.response?.data?.error || err.message));
          await loadData();
        }
      }
      return;
    }

    // 2. TỪ BACKLOG ĐƯA VÀO SPRINT (US-018)
    if (isCurrentlyInBacklog && targetZone === "SPRINT") {
      try {
        await updateUserStory(activeId, { sprintId: targetSprintId, status: "TODO" });
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Không thể đưa vào Sprint");
      }
      return;
    }

    // 3. TỪ SPRINT RÚT VỀ BACKLOG
    if (!isCurrentlyInBacklog && targetZone === "BACKLOG") {
      try {
        await updateUserStory(activeId, { sprintId: null, status: "BACKLOG" });
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Không thể rút về Backlog");
      }
      return;
    }

    // 4. CHUYỂN GIỮA CÁC SPRINT HOẶC TRONG CÙNG SPRINT (Basic Support)
    if (!isCurrentlyInBacklog && targetZone === "SPRINT" && activeStory.sprintId !== targetSprintId) {
      try {
        await updateUserStory(activeId, { sprintId: targetSprintId });
        await loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }
  };

  // ====================== Các hàm cũ giữ nguyên ======================
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStory) {
        await updateUserStory(editingStory.id, formData);
      } else {
        await createUserStory({
          ...formData,
          projectId,
          status: "BACKLOG"
        });
      }
      await loadData();
      setIsModalOpen(false);
      setEditingStory(null);
    } catch (error) {
      console.error("Lỗi khi lưu User Story:", error);
      window.alert(error.response?.data?.message || error.response?.data?.error || "Lỗi khi lưu User Story!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa User Story này?")) return;
    try {
      await api.delete(`/userstory/${storyId}`);
      await loadData();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi khi xóa!");
    }
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleAddStory = () => {
    setEditingStory(null);
    setIsModalOpen(true);
  };

  const handleAssignStory = async (storyId) => {
    const email = window.prompt("Nhập Email của người phụ trách:");
    if (!email) return;
    try {
      await api.patch(`/userstory/${storyId}/assign`, { email });
      await loadData();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi assign!");
    }
  };

  const handleSprintStatusChange = async (sprintId, newStatus) => {
    try {
      await api.patch(`/sprint/${sprintId}`, { status: newStatus });
      await loadData();
    } catch (err) {
      console.error("Lỗi cập nhật status Sprint:", err);
      alert("Không thể cập nhật trạng thái Sprint.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activeSprints = sprints.filter(s => s.status === "ACTIVE");
  const plannedSprints = sprints.filter(s => s.status === "PLANNED");

  return (
    <MainLayout 
      activePage="Backlog"
      header={<BacklogHeader projectId={projectId} projectName={project?.name} />}
      projectId={projectId}
    >
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6 md:space-y-10 pb-20">
          {/* TOP: Active Sprints */}
          <div className="space-y-4">
            <div className="flex items-center px-2">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                Current Sprints
              </h3>
            </div>
            
            {activeSprints.length > 0 ? (
              activeSprints.map(sprint => (
                <SprintSection 
                  key={sprint.id}
                  sprint={sprint}
                  stories={stories.filter(s => s.sprintId === sprint.id)} 
                  onAssign={handleAssignStory}
                  onEdit={handleEditStory}
                  onDelete={handleDeleteStory}
                  onStatusChange={handleSprintStatusChange}
                  userRole={userRole}
                />
              ))
            ) : (
              <div className="p-8 border border-outline-variant/10 rounded-3xl flex flex-col items-center justify-center text-on-surface-variant/40 gap-2 bg-surface-container-low/20">
                <span className="material-symbols-outlined text-3xl opacity-20">bolt</span>
                <p className="text-xs font-medium italic">No active sprints. Start one from the planning area below.</p>
              </div>
            )}
          </div>
          
          {/* MIDDLE: Product Backlog */}
          <ProductBacklog 
            stories={filteredBacklogStories}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterPriority={filterPriority}
            onFilterPriorityChange={setFilterPriority}
            onAddStory={handleAddStory} 
            onAssignStory={handleAssignStory} 
            onEdit={handleEditStory}
            onDelete={handleDeleteStory}
            userRole={userRole} 
            onMoveToSprint={async (id) => {
              const latestSprint = sprints.find(s => s.status === 'PLANNED') || sprints[0];
              if (!latestSprint) {
                alert("Vui lòng tạo một Sprint trước.");
                return;
              }
              if (window.confirm(`Đưa User Story này vào ${latestSprint.name}?`)) {
                try {
                  await updateUserStory(id, { sprintId: latestSprint.id, status: "TODO" });
                  await loadData();
                } catch (err) {
                  alert("Có lỗi khi đưa vào Sprint");
                }
              }
            }}
          />

          {/* BOTTOM: Planned Sprints (Sprint Planning Area) */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined">event_note</span>
                Sprint Planning
              </h3>
              {userRole !== "MEMBER" && (
                <button 
                  onClick={() => setIsSprintModalOpen(true)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  New Sprint
                </button>
              )}
            </div>
            
            {plannedSprints.length > 0 ? (
              plannedSprints.map(sprint => (
                <SprintSection 
                  key={sprint.id}
                  sprint={sprint}
                  stories={stories.filter(s => s.sprintId === sprint.id)} 
                  onAssign={handleAssignStory}
                  onEdit={handleEditStory}
                  onDelete={handleDeleteStory}
                  onStatusChange={handleSprintStatusChange}
                  userRole={userRole}
                />
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-outline-variant/20 rounded-3xl flex flex-col items-center justify-center text-on-surface-variant/50 gap-2 bg-surface-container-low/30">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
                <p className="text-sm font-medium">No planned sprints. Create one to start planning.</p>
              </div>
            )}
          </div>
        </div>
      </DndContext>

      <CreateSprintModal 
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        projectId={projectId}
        onCreated={loadData}
      />

      <CreateStoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        loading={isSubmitting}
        initialData={editingStory}
      />
    </MainLayout>
  );
}