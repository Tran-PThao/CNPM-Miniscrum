import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// === Thêm thư viện Drag & Drop ===
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import MainLayout from "../components/MainLayout";
import BacklogHeader from "../components/BacklogHeader";
import SprintSection from "../components/SprintSection";
import ProductBacklog from "../components/ProductBacklog";
import api, { getStoriesByProject, createUserStory, updateUserStory } from "../services/api";
import CreateStoryModal from "../components/CreateStoryModal";

export default function Backlog() {
  const { projectId } = useParams();
  
  // === State cũ giữ nguyên (US-007 & US-008) ===
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [stories, setStories] = useState([]);
  const [project, setProject] = useState(null);
  const [userRole, setUserRole] = useState("MEMBER");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      api.get(`/project/${projectId}`),
      api.get(`/project/${projectId}/role`)
    ]).then(([storiesRes, projectRes, roleRes]) => {
      setStories(Array.isArray(storiesRes.data) ? storiesRes.data : []);
      setProject(projectRes.data);
      setUserRole(roleRes.data.role);
    }).catch(err => {
      console.error("Lỗi tải dữ liệu:", err);
    }).finally(() => setIsLoading(false));
  }, [projectId, navigate]);

  const loadStories = async () => {
    try {
      const res = await getStoriesByProject(projectId);
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải stories:", err);
    }
  };

  // === Lọc stories cho Product Backlog (giữ nguyên US-007 + US-008) ===
  const backlogStories = stories.filter(s => s.status === "BACKLOG");

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
    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeStory = stories.find(s => s.id === activeId);
    if (!activeStory) return;

    const isActiveInBacklog = activeStory.status === "BACKLOG";

    // 1. Kéo trong cùng Product Backlog (sắp xếp thứ tự)
    if (isActiveInBacklog && overId === "backlog-droppable-area") {
      console.log(`Kéo sắp xếp trong Backlog: ${activeStory.title}`);
      // Hiện tại chưa lưu thứ tự vào DB, chỉ log để test
      // Sau này sẽ thêm logic lưu order
      return;
    }

    // 2. Kéo từ Product Backlog sang Sprint
    if (isActiveInBacklog && overId !== "backlog-droppable-area") {
      console.log(`Đưa vào Sprint: ${activeStory.title}`);
      try {
        await api.patch(`/userstory/${activeId}`, { status: "TODO" });
        await loadStories();
      } catch (err) {
        console.error(err);
        alert("Không thể đưa vào Sprint");
      }
      return;
    }

    // 3. Kéo từ Sprint về Product Backlog
    if (!isActiveInBacklog && overId === "backlog-droppable-area") {
      console.log(`Đưa về Backlog: ${activeStory.title}`);
      try {
        await api.patch(`/userstory/${activeId}`, { status: "BACKLOG" });
        await loadStories();
      } catch (err) {
        console.error(err);
        alert("Không thể đưa về Backlog");
      }
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
      await loadStories();
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
      await loadStories();
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
      await loadStories();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi assign!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <MainLayout 
      activePage="Backlog"
      header={<BacklogHeader projectId={projectId} projectName={project?.name} />}
      projectId={projectId}
    >
      {/* Bọc DndContext quanh toàn bộ nội dung */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6 md:space-y-10">
          <SprintSection 
            stories={stories.filter(s => s.status !== "BACKLOG")} 
            onAssign={handleAssignStory}
            onEdit={handleEditStory}
            onDelete={handleDeleteStory}
            userRole={userRole}
          />
          
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
              if (window.confirm("Đưa User Story này vào Sprint hiện tại?")) {
                try {
                  await api.patch(`/userstory/${id}`, { status: "TODO" });
                  await loadStories();
                } catch (err) {
                  alert("Có lỗi khi đưa vào Sprint");
                }
              }
            }}
          />
        </div>
      </DndContext>

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