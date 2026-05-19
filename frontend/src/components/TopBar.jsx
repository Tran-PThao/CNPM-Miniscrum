import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import { getInvitations, respondToInvitation, getNotifications, markNotificationAsRead } from "../services/api";

export default function TopBar() {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 60000);

    // Tự động mở thông báo nếu có query param ?showNotifications=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("showNotifications") === "true") {
      setShowNotifications(true);
    }

    return () => clearInterval(timer);
  }, [window.location.search]);

  const fetchData = async () => {
    try {
      const [invRes, notifRes] = await Promise.all([
        getInvitations(),
        getNotifications()
      ]);
      setInvitations(invRes.data);
      setNotifications(notifRes.data);
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    }
  };

  const handleRespond = async (id, action) => {
    try {
      await respondToInvitation(id, action);
      await fetchData();
      if (action === "ACCEPT") {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Lỗi khi xử lý lời mời");
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      fetchData();
    } catch (err) {
      console.error("Lỗi đọc thông báo:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 bg-[#f8f9fb]/80 backdrop-blur-xl z-30 border-b border-outline-variant/10">
      {/* Search + Menu */}
      <div className="flex items-center gap-3 md:gap-6 w-full max-w-sm md:max-w-none">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative flex-1 md:flex-none">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm md:text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:block p-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors">
          <span className="material-symbols-outlined">timer</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#44474e] hover:bg-[#f1f3f8] rounded-full transition-colors relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {(invitations.length + notifications.filter(n => !n.isRead).length) > 0 && (
              <span className="absolute top-2 right-2 min-w-[14px] h-[14px] px-1 bg-error text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {invitations.length + notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low flex items-center justify-between">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-wider">Thông báo</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {invitations.length + notifications.filter(n => !n.isRead).length} Mới
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {/* System Notifications */}
                  {notifications.filter(n => !n.isRead).map(notif => (
                    <div key={notif.id} className="p-4 border-b border-outline-variant/5 bg-primary/5 hover:bg-primary/10 transition-colors group relative">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined">person_remove</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-error uppercase tracking-widest leading-none mb-1">Cảnh báo hệ thống</span>
                            <span className="text-[9px] font-medium text-on-surface-variant opacity-50">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-on-surface leading-snug font-medium">
                            {notif.content}
                          </p>
                          <button 
                            onClick={() => handleReadNotification(notif.id)}
                            className="mt-2 text-[10px] font-bold text-primary hover:underline"
                          >
                            Đánh dấu đã đọc
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Invitations */}
                  {invitations.length > 0 ? (
                    invitations.map(inv => (
                      <div key={inv.id} className="p-4 border-b border-outline-variant/5 hover:bg-surface-container-lowest transition-colors group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">group_add</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-on-surface leading-snug">
                              Bạn đã được mời tham gia dự án <strong>{inv.project.name}</strong> ({inv.project.key}) với vai trò <strong>{inv.role}</strong>.
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => handleRespond(inv.id, "ACCEPT")}
                                className="flex-1 py-1.5 bg-primary text-on-primary rounded-lg text-[11px] font-bold hover:opacity-90 transition-all shadow-sm"
                              >
                                Chấp nhận
                              </button>
                              <button 
                                onClick={() => handleRespond(inv.id, "DECLINE")}
                                className="flex-1 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-[11px] font-bold hover:bg-error/10 hover:text-error transition-all"
                              >
                                Từ chối
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : notifications.filter(n => !n.isRead).length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/30 italic">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                      <p className="text-xs">Không có thông báo mới nào</p>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-container-lowest text-center">
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Xem tất cả hoạt động
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-[1px] bg-outline-variant mx-1 sm:mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="group flex items-center gap-2 p-1 pr-3 rounded-full border border-outline-variant/10 hover:bg-surface-container-high transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
              {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-xs font-bold text-on-surface opacity-80">{currentUser.fullName}</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:rotate-180 transition-transform">expand_more</span>
          </button>

          {/* User Menu Dropdown */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-outline-variant/10 py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-6 py-4 border-b border-outline-variant/10 mb-2">
                  <div className="text-sm font-bold text-on-surface">{currentUser.fullName}</div>
                  <div className="text-[10px] font-medium text-on-surface-variant opacity-60">ID: {currentUser.id?.slice(-8)}</div>
                </div>
                
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center gap-4 px-6 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all text-left"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  <span>Cài đặt cá nhân</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-3 text-sm font-bold text-error hover:bg-error/5 transition-all text-left mt-2"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
