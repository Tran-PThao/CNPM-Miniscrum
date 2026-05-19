import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";
import BoardTopBar from "../components/BoardTopBar";
import KanbanColumn from "../components/KanbanColumn";
import FAB from "../components/FAB";
import api, { getStoriesByProject, updateUserStory } from "../services/api";
import CreateStoryModal from "../components/CreateStoryModal";
import CompleteSprintModal from "../components/CompleteSprintModal";

export default function BoardPage() {
  const { projectId } = useParams();
  const [stories, setStories] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [plannedSprints, setPlannedSprints] = useState([]);
  const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("MEMBER");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

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
      const [storiesRes, sprintsRes] = await Promise.all([
        getStoriesByProject(projectId),
        api.get(`/project/${projectId}/sprints`)
      ]);
      
      const active = (Array.isArray(sprintsRes.data) ? sprintsRes.data : [])
                      .find(s => s.status === 'ACTIVE');
      setActiveSprint(active);
      setPlannedSprints((Array.isArray(sprintsRes.data) ? sprintsRes.data : [])
                      .filter(s => s.status === 'PLANNED'));

      if (active) {
        setStories(Array.isArray(storiesRes.data) ? storiesRes.data.filter(s => s.sprintId === active.id) : []);
      } else {
        setStories([]);
      }
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
  const rejectedCards = prepareCards('REJECTED'); // Thêm dòng này

  return (
    <MainLayout 
      activePage="Board"
      header={<BoardTopBar projectId={projectId} />}
      projectId={projectId}
    >
      <div className="h-full">
        {activeSprint ? (
          <>
            <div className="mb-4 flex items-center gap-4 px-2 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-xs font-black text-primary uppercase tracking-widest">Active Sprint:</span>
                <span className="ml-2 text-sm font-bold text-on-surface">{activeSprint.name}</span>
              </div>
              {activeSprint.endDate && (
                <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Kết thúc ngày: {new Date(activeSprint.endDate).toLocaleDateString()}
                </div>
              )}
              {userRole === 'SM' && (
                <button 
                  onClick={() => setIsCompleteSprintModalOpen(true)}
                  className="ml-auto px-4 py-1.5 bg-emerald-600/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  Kết thúc Sprint
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto pb-6">
              <div className="flex h-full gap-4 md:gap-8 min-w-[1200px] md:min-w-0 md:grid md:grid-cols-4">
                <KanbanColumn title="To Do" status="TODO" items={todoCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
                <KanbanColumn title="In Progress" status="IN_PROGRESS" items={inProgressCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
                <KanbanColumn title="Done" status="DONE" items={doneCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
                <KanbanColumn title="Rejected" status="REJECTED" items={rejectedCards} onUpdateItem={handleStatusUpdate} onAssign={handleAssign} onEdit={handleEditStory} onDelete={handleDeleteStory} userRole={userRole} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-surface-container rounded-[2rem] flex items-center justify-center text-on-surface-variant/20 mb-6 border-2 border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl">view_kanban</span>
            </div>
            <h2 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Chưa có Sprint nào đang hoạt động</h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-8 font-medium">
              Vào mục <span className="text-primary font-bold">Backlog</span> để lập kế hoạch và bắt đầu một Sprint mới để kích hoạt bảng Kanban.
            </p>
            <button 
              onClick={() => navigate(`/projects/${projectId}/backlog`)}
              className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              Đi tới Backlog
            </button>
          </div>
        )}
      </div>

      <CreateStoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        loading={isSubmitting}
        initialData={editingStory}
        currentUser={currentUser}
      />

      {/* FAB */}
      <FAB onClick={() => { setEditingStory(null); setIsModalOpen(true); }} />

      <CompleteSprintModal 
        isOpen={isCompleteSprintModalOpen}
        onClose={() => setIsCompleteSprintModalOpen(false)}
        sprint={activeSprint}
        stories={stories}
        plannedSprints={plannedSprints}
        onCompleted={loadStories}
      />
    </MainLayout>
  );
}
