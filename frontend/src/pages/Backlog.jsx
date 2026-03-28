import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import BacklogHeader from "../components/BacklogHeader";
import SprintSection from "../components/SprintSection";
import ProductBacklog from "../components/ProductBacklog";
import api, { getStoriesByProject, createUserStory } from "../services/api";
import CreateStoryModal from "../components/CreateStoryModal";

export default function Backlog() {
  const { projectId } = useParams();
  const [stories, setStories] = useState([]);
  const [project, setProject] = useState(null);
  const [userRole, setUserRole] = useState("MEMBER");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for custom event from Sidebar
    const handleOpenModal = () => { setEditingStory(null); setIsModalOpen(true); };
    window.addEventListener("open-create-story-modal", handleOpenModal);
    
    // Check URL params for action
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "create") {
      setEditingStory(null);
      setIsModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!projectId) {
      api.get("/project").then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          navigate(`/projects/${res.data[0].id}/backlog`, { replace: true });
        } else {
          navigate("/dashboard");
        }
      }).catch(() => navigate("/login"));
    }

    return () => window.removeEventListener("open-create-story-modal", handleOpenModal);
  }, [navigate, projectId]);

  useEffect(() => {
    if (projectId) {
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
    }
  }, [projectId]);

  const loadStories = async () => {
    try {
      const res = await getStoriesByProject(projectId);
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi khi tải stories:", err);
    }
  };

  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStory) {
        await api.patch(`/userstory/${editingStory.id}`, formData);
      } else {
        await createUserStory({ ...formData, projectId, status: "BACKLOG" });
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

  const handleUpdateStatus = async (storyId, newStatus) => {
    try {
      await api.patch(`/userstory/${storyId}`, { status: newStatus });
      await loadStories();
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái:", e);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa User Story này? Hành động này không thể hoàn tác.")) return;
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
    const email = window.prompt("Nhập Email của người phụ trách (VD: admin@miniscrum.com):");
    if (!email) return;
    try {
      await api.patch(`/userstory/${storyId}/assign`, { email });
      await loadStories();
    } catch (e) {
      window.alert(e.response?.data?.error || "Lỗi assign. Kiểm tra lại email.");
    }
  };

  // Chia story thành 2 phần: Backlog (status === 'BACKLOG') và Sprint (còn lại)
  const backlogStories = stories.filter(s => s.status === "BACKLOG");
  const sprintStories = stories.filter(s => s.status !== "BACKLOG");

  // Tính toán % tiến độ dựa trên số lượng story DONE trong sprint
  const doneStories = sprintStories.filter(s => s.status === "DONE");
  const progressPercent = sprintStories.length > 0 
    ? Math.round((doneStories.length / sprintStories.length) * 100) 
    : 0;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <MainLayout 
      activePage="Backlog"
      header={<BacklogHeader projectId={projectId} projectName={project?.name} />}
      projectId={projectId}
    >
      <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
        <SprintSection 
          stories={sprintStories} 
          progress={progressPercent}
          onMoveToBacklog={(id) => handleUpdateStatus(id, "BACKLOG")}
          onAssign={handleAssignStory}
          onEdit={handleEditStory}
          onDelete={handleDeleteStory}
          userRole={userRole}
        />
        
        <ProductBacklog 
          stories={backlogStories} 
          onAddStory={handleAddStory} 
          onAssignStory={handleAssignStory} 
          onEdit={handleEditStory}
          onDelete={handleDeleteStory}
          userRole={userRole} 
          onMoveToSprint={(id) => handleUpdateStatus(id, "TODO")}
        />
      </div>

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
