import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import BoardTopBar from "../components/BoardTopBar";
import KanbanColumn from "../components/KanbanColumn";
import FAB from "../components/FAB";
import api, { getStoriesByProject, updateUserStory } from "../services/api";
import CreateStoryModal from "../components/CreateStoryModal";

export default function BoardPage() {
  const { projectId } = useParams();
  const [stories, setStories] = useState([]);
  const [userRole, setUserRole] = useState("MEMBER");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) {
      api.get("/project").then((res) => {
        if (res.data && res.data.length > 0) {
          navigate(`/projects/${res.data[0].id}/board`, { replace: true });
        } else {
          navigate("/dashboard");
        }
      }).catch(() => navigate("/login"));
    }
  }, [navigate, projectId]);

  useEffect(() => {
    if (projectId) {
      loadStories();
      api.get(`/project/${projectId}/role`).then(res => setUserRole(res.data.role));
    }
  }, [projectId]);

  const loadStories = async () => {
    try {
      const res = await getStoriesByProject(projectId);
      // Chỉ hiện các story KHÔNG phải BACKLOG (tức là đang trong Sprint: TODO, IN_PROGRESS, DONE)
      setStories(Array.isArray(res.data) ? res.data.filter(s => s.status !== "BACKLOG") : []);
    } catch (err) {
      console.error("Lỗi khi tải bảng Kanban:", err);
    }
  };

  const handleStatusUpdate = async (storyId, newStatus) => {
    try {
      await updateUserStory(storyId, { status: newStatus });
      loadStories();
    } catch (e) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa User Story này?")) return;
    try {
      await api.delete(`/userstory/${storyId}`);
      loadStories();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi khi xóa!");
    }
  };

  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStory) {
        await api.patch(`/userstory/${editingStory.id}`, formData);
      } else {
        await api.post('/userstory', { ...formData, projectId, status: "TODO" });
      }
      await loadStories();
      setIsModalOpen(false);
      setEditingStory(null);
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi xử lý user story!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (storyId) => {
    const email = window.prompt("Nhập Email của người phụ trách (VD: admin@miniscrum.com):");
    if (!email) return;
    try {
      await api.patch(`/userstory/${storyId}/assign`, { email });
      loadStories();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi assign. Kiểm tra lại email.");
    }
  };

  const prepareCards = (statusMatches) => {
    return stories.filter(s => s.status === statusMatches).map(s => ({
      ...s,
      attachments: 0,
      avatars: s.assignee?.fullName ? [s.assignee.fullName] : [],
      progress: statusMatches === 'IN_PROGRESS' ? 50 : undefined
    }));
  };

  const todoCards = prepareCards('TODO');
  const inProgressCards = prepareCards('IN_PROGRESS');
  const doneCards = prepareCards('DONE');

  return (
    <MainLayout 
      activePage="Board"
      header={<BoardTopBar projectId={projectId} />}
      projectId={projectId}
    >
      <div className="h-full">
        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex h-full gap-4 md:gap-8 min-w-[900px] md:min-w-0 md:grid md:grid-cols-3">
            <KanbanColumn title="To Do" status="TODO" items={todoCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
            <KanbanColumn title="In Progress" status="IN_PROGRESS" items={inProgressCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
            <KanbanColumn title="Done" status="DONE" items={doneCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
          </div>
        </div>
      </div>

      <CreateStoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        loading={isSubmitting}
        initialData={editingStory}
      />

      {/* FAB */}
      <FAB onClick={() => { setEditingStory(null); setIsModalOpen(true); }} />
    </MainLayout>
  );
}
