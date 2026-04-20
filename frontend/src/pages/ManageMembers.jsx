import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ROLES = ['PO', 'SM', 'MEMBER'];
const ROLE_STYLE = {
  PO: "bg-error-container text-on-error-container ring-1 ring-error/20",
  SM: "bg-tertiary-container text-on-tertiary-container ring-1 ring-tertiary/20",
  MEMBER: "bg-secondary-container text-on-secondary-container ring-1 ring-secondary/20",
};

export default function ManageMembers() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Smart Invite states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (projectId) fetchMembers();
  }, [projectId]);

  // Search logic (Autocomplete)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        api.get(`/users/search?query=${searchQuery}`)
          .then(res => setSuggestions(res.data))
          .catch(() => setSuggestions([]))
          .finally(() => setIsSearching(false));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/project/${projectId}/members`);
      setMembers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tải danh sách thành viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (user) => {
    setIsInviting(true);
    setSearchQuery("");
    setSuggestions([]);
    try {
      await api.post(`/project/${projectId}/invite`, { userId: user.id });
      setSuccess(`Đã mời ${user.fullName} vào dự án!`);
      await fetchMembers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi mời thành viên.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError(null); setSuccess(null); setUpdatingId(userId);
    try {
      await api.patch(`/project/${projectId}/members/${userId}/role`, { role: newRole });
      setSuccess('Cập nhật quyền hạn thành công!');
      setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: newRole } : m));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi cập nhật role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleKick = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${userName} khỏi dự án? Mọi task đang gán cho người này sẽ trở về trạng thái 'Chưa gán'.`)) return;
    setError(null); setSuccess(null); setUpdatingId(userId);
    try {
      await api.delete(`/project/${projectId}/members/${userId}`);
      setSuccess(`Đã xóa ${userName} khỏi dự án.`);
      setMembers(prev => prev.filter(m => m.userId !== userId));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi xóa thành viên.');
    } finally {
      setUpdatingId(null);
    }
  };

  const currentMember = members.find(m => m.userId === currentUser.id);
  const isPO = currentMember?.role === 'PO';
  const isManagement = currentMember?.role === 'PO' || currentMember?.role === 'SM';

  const avatarColor = (name = "U") => {
    const colors = ['bg-primary', 'bg-tertiary', 'bg-error', 'bg-secondary'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest font-['Inter']">
      <nav className="bg-surface-container h-16 flex items-center justify-between px-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-lg">group</span>
          </div>
          <span className="font-bold text-on-surface tracking-tight">Mini Scrum • Quản lý Team</span>
        </div>
        <button 
          onClick={() => navigate(`/projects/${projectId}/backlog`)}
          className="px-4 py-2 bg-surface text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/5 transition-all"
        >
          ← Back to Project
        </button>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-surface-variant/5 border border-outline-variant/10 overflow-hidden">
          {/* Header section */}
          <div className="p-8 border-b border-outline-variant/10 bg-surface-container-low flex items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tighter mb-1">Thành viên Dự án</h1>
              <p className="text-sm text-on-surface-variant font-medium">
                {isPO ? 'Bạn là Product Owner (PO) — có quyền thay đổi vai trò và xóa thành viên.' : isManagement ? 'Bạn là Scrum Master (SM) — có quyền thay đổi vai trò và mời thành viên.' : 'Bạn đang xem danh sách thành viên dự án.'}
              </p>
            </div>
            <div className="bg-primary/5 px-4 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-2xl font-black text-primary leading-none">{members.length}</span>
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Members</span>
            </div>
          </div>

          <div className="p-8">
            {/* SMART INVITE SECTION */}
            {isManagement && (
              <div className="mb-10 relative">
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-3">Mời thành viên mới</label>
                <div className="relative group">
                  <div className={`flex items-center gap-3 bg-surface-container-low border ${searchQuery ? 'border-primary' : 'border-outline-variant/10'} rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-primary/10 transition-all`}>
                    <span className="material-symbols-outlined text-primary/60 group-focus-within:text-primary transition-colors">person_add</span>
                    <input 
                      type="text" 
                      placeholder="Tìm theo Tên hoặc Email (nhập từ 2 ký tự)..."
                      className="bg-transparent border-none outline-none flex-1 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />}
                  </div>

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {suggestions.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleInvite(user)}
                          disabled={isInviting || members.some(m => m.userId === user.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-all text-left border-b border-outline-variant/10 last:border-0 group/item"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface text-sm">{user.fullName}</div>
                              <div className="text-xs text-on-surface-variant italic">{user.email}</div>
                            </div>
                          </div>
                          {members.some(m => m.userId === user.id) ? (
                            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-3 py-1 bg-surface-container rounded-full">Đã tham gia</span>
                          ) : (
                            <span className="material-symbols-outlined text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">add_task</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[10px] text-on-surface-variant/60 font-medium px-1 italic">
                  Chỉ những người đã đăng ký tài khoản mới xuất hiện trong tìm kiếm.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2">
                <span className="material-symbols-outlined">warning</span> {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2">
                <span className="material-symbols-outlined">check_circle</span> {success}
              </div>
            )}

            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 text-on-surface-variant">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-sm font-bold">Đang tải danh sách...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="py-20 text-center text-on-surface-variant opacity-60">
                <span className="material-symbols-outlined text-5xl mb-3">person_search</span>
                <p className="font-bold">Chưa có thành viên nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.userId} className="group flex items-center justify-between p-4 rounded-2xl border border-outline-variant/10 hover:bg-surface-container-low transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${avatarColor(member.user.fullName)} flex items-center justify-center text-on-primary font-bold text-lg ring-4 ring-white shadow-sm`}>
                        {member.user.fullName?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{member.user.fullName}</span>
                          {member.userId === currentUser.id && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Bạn</span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium opacity-70">{member.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {member.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl animate-pulse">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">Đang chờ</span>
                        </div>
                      )}

                      {isPO && member.userId !== currentUser.id && (
                        <button 
                          onClick={() => handleKick(member.userId, member.user.fullName)}
                          className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                          title="Xóa thành viên"
                        >
                          <span className="material-symbols-outlined text-lg">person_remove</span>
                        </button>
                      )}

                      {isManagement && member.userId !== currentUser.id ? (
                        <div className="relative">
                          <select
                            value={member.role}
                            disabled={updatingId === member.userId}
                            onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                            className="appearance-none bg-surface-container px-4 py-2 pr-10 rounded-xl text-[11px] font-black text-on-surface-variant border-none focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all uppercase tracking-widest"
                          >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-50 text-primary">expand_more</span>
                        </div>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${ROLE_STYLE[member.role]}`}>
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
