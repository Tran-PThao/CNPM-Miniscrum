import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import SprintProgress from "../components/SprintProgress";
import MyTasks from "../components/MyTasks";
import RecentActivity from "../components/RecentActivity";
import SprintStats from "../components/SprintStats";
import FAB from "../components/FAB";
import api, { getDashboardStats } from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    api.get("/project").then((res) => {
      setProjects(res.data);
      if (res.data && res.data.length > 0) {
        if (!projectId) setProjectId(res.data[0].id);
      }
      setIsLoading(false);
    }).catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => {
    if (projectId) {
      setStats(null);
      getDashboardStats(projectId).then(res => setStats(res.data)).catch(console.error);
    }
  }, [projectId]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const activeProject = projects.find(p => p.id === projectId);

  // Nếu không có dự án nào (ACCEPTED)
  if (projects.length === 0) {
    return (
      <MainLayout activePage="Dashboard">
        <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-primary/5 border border-outline-variant/5 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-8 animate-bounce transition-all">
              <span className="material-symbols-outlined text-5xl">rocket_launch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-4 font-['Manrope']">
              Chào mừng bạn đến với <span className="text-primary tracking-tight">mINI Scrum</span>
            </h2>
            <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed font-medium">
              Có vẻ như bạn chưa tham gia vào dự án nào. Hãy bắt đầu bằng cách tạo dự án mới hoặc chờ lời mời từ đồng nghiệp trên thanh thông báo.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => navigate("/create-project")}
                className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all text-sm flex items-center gap-3"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Tạo dự án đầu tiên
              </button>
              <button 
                onClick={() => navigate("/dashboard?showNotifications=true")}
                className="px-10 py-4 bg-surface-container-low text-on-surface-variant rounded-2xl font-bold text-sm border border-outline-variant/10 flex items-center gap-3 hover:bg-primary/5 transition-all"
              >
                <span className="material-symbols-outlined">notifications_active</span>
                Kiểm tra lời mời
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="Dashboard" projectId={projectId}>
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Welcome / Sprint Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 pt-2">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tighter mb-3 font-['Manrope']">
              {activeProject?.name || "Project Overview"}
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase">
                Sprint 1 Active
              </span>
              <p className="text-on-surface-variant text-sm font-medium opacity-70">
                Precision Dashboard • {activeProject?.key || "MGMT"}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate("/create-project")}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all text-sm group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
            <span>Tạo dự án mới</span>
          </button>
        </div>

        {/* Project Selector Section */}
        <div className="mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 px-2">
            {projects.map(p => (
              <div
                key={p.id}
                onClick={() => setProjectId(p.id)}
                className={`flex-shrink-0 p-1.5 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-3 min-w-[240px] relative group ${
                  projectId === p.id 
                  ? "bg-primary text-on-primary border-primary shadow-2xl shadow-primary/30 scale-105 z-10" 
                  : "bg-white text-on-surface border-outline-variant/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${projectId === p.id ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1 min-w-0 pr-2">
                  <div className="font-extrabold text-sm block truncate pr-8">{p.name}</div>
                  <div className={`text-[10px] font-black opacity-70 uppercase tracking-widest ${projectId === p.id ? "text-white/80" : "text-primary"}`}>
                    {p.key}
                  </div>
                </div>

                {/* Open Project CTA on Selected Card */}
                {projectId === p.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${p.id}/backlog`);
                    }}
                    className="absolute right-3 p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-all animate-in zoom-in-50 duration-300"
                    title="Mở dự án"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                )}
                
                {/* Visual Hint for Unselected Cards */}
                {projectId !== p.id && (
                  <span className="material-symbols-outlined absolute right-4 text-primary/0 group-hover:text-primary/40 transition-all transform translate-x-2 group-hover:translate-x-0">
                    touch_app
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SprintProgress completed={stats.progressPercentage} done={stats.completedStories} left={stats.todoStories + stats.inProgressStories} />
            <MyTasks />
            <RecentActivity />
            <SprintStats
              timeRemaining="4 Days 12h"
              velocity={stats.completedPoints || 0}
              capacity={stats.totalPoints || 0}
            />
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 text-on-surface-variant opacity-50">
             <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
             <span className="text-sm font-bold">Đang tải thống kê dự án...</span>
          </div>
        )}
      </div>

      {/* Floating Action Button - Chuyển sang Backlog để quản lý Story/Task */}
      {projectId && (
        <FAB 
          onClick={() => navigate(`/projects/${projectId}/backlog`)} 
          title="Quản lý Backlog & Task"
          icon="inventory_2"
        />
      )}
    </MainLayout>
  );
}
