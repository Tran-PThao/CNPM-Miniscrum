import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ROLES = ['PO', 'SM', 'DEV'];
const ROLE_STYLE = {
  PO: { background: '#FFEBE6', color: '#BF2600', border: '1px solid #FF8F73' },
  SM: { background: '#FFF0B3', color: '#172B4D', border: '1px solid #FFE380' },
  DEV: { background: '#DEEBFF', color: '#0052CC', border: '1px solid #4C9AFF' },
};

const ManageMembers = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/project/${projectId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(res.data);
    } catch (_err) {
      setError('Không thể tải danh sách thành viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError(null); setSuccess(null); setUpdatingId(userId);
    try {
      await axios.patch(
        `http://localhost:5000/api/project/${projectId}/members/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Cập nhật role thành công!');
      setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: newRole } : m));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi cập nhật role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const currentMember = members.find(m => m.userId === currentUser.id);
  const isPO = currentMember?.role === 'PO';

  return (
    <div style={st.page}>
      <nav style={st.nav}>
        <div style={st.navLeft}>
          <div style={st.logoWrap}>
            <div style={st.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#fff" opacity="0.9"/>
                <path d="M12 2L4 7l8 5 8-5-8-5z" fill="#fff"/>
              </svg>
            </div>
            <span style={st.logoText}>Mini Scrum</span>
          </div>
        </div>
        <button style={st.backBtn} onClick={() => navigate('/dashboard')}>← Quay về Dashboard</button>
      </nav>

      <main style={st.main}>
        <div style={st.breadcrumb}>
          <span style={st.breadcrumbLink} onClick={() => navigate('/dashboard')}>Dự án</span>
          <span style={st.breadcrumbSep}>/</span>
          <span style={st.breadcrumbCurrent}>Quản lý thành viên</span>
        </div>

        <div style={st.card}>
          <div style={st.cardTop}>
            <div style={st.cardIcon}>👥</div>
            <div style={{ flex: 1 }}>
              <h1 style={st.cardTitle}>Quản lý thành viên</h1>
              <p style={st.cardSubtitle}>
                {isPO ? 'Bạn là PO — có thể thay đổi role của thành viên.' : 'Chỉ PO mới có thể thay đổi role.'}
              </p>
            </div>
            <div style={st.memberCount}>
              <span style={st.memberCountNum}>{members.length}</span>
              <span style={st.memberCountLabel}>thành viên</span>
            </div>
          </div>

          {!isPO && !loading && (
            <div style={st.warningBox}>
              <span>ℹ</span> Bạn chỉ có thể xem danh sách. Chỉ PO mới được đổi role.
            </div>
          )}
          {error && <div style={st.errorBox}><span>⚠</span> {error}</div>}
          {success && <div style={st.successBox}><span>✓</span> {success}</div>}

          {loading ? (
            <div style={st.loadingWrap}>
              <div style={st.spinner} />
              <span style={{ color: "#6B778C", fontSize: 14 }}>Đang tải thành viên...</span>
            </div>
          ) : members.length === 0 ? (
            <div style={st.emptyState}>
              <div style={{ fontSize: 40 }}>👤</div>
              <p style={{ color: "#6B778C", fontSize: 14 }}>Chưa có thành viên nào trong dự án này.</p>
            </div>
          ) : (
            <div style={st.table}>
              <div style={st.tableHeader}>
                <div style={{ ...st.th, flex: 2 }}>Thành viên</div>
                <div style={{ ...st.th, flex: 2 }}>Email</div>
                <div style={{ ...st.th, flex: 1 }}>Role hiện tại</div>
                {isPO && <div style={{ ...st.th, flex: 1 }}>Đổi role</div>}
              </div>
              {members.map((member, idx) => (
                <div key={member.userId} style={{ ...st.tableRow, background: idx % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <div style={{ ...st.td, flex: 2 }}>
                    <div style={st.memberInfo}>
                      <div style={{ ...st.avatar, background: avatarColor(member.user.fullName) }}>
                        {member.user.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={st.memberName}>
                          {member.user.fullName || '(Chưa đặt tên)'}
                          {member.userId === currentUser.id && <span style={st.youBadge}>Bạn</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ ...st.td, flex: 2, color: '#42526E', fontSize: 13 }}>{member.user.email}</div>
                  <div style={{ ...st.td, flex: 1 }}>
                    <span style={{ ...st.roleBadge, ...ROLE_STYLE[member.role] }}>{member.role}</span>
                  </div>
                  {isPO && (
                    <div style={{ ...st.td, flex: 1 }}>
                      {member.userId === currentUser.id ? (
                        <span style={{ fontSize: 12, color: '#6B778C' }}>—</span>
                      ) : (
                        <select
                          value={member.role}
                          disabled={updatingId === member.userId}
                          onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                          style={st.select}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function avatarColor(name) {
  const colors = ['#0052CC', '#00875A', '#6554C0', '#FF5630', '#FF8B00', '#00B8D9'];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}

const st = {
  page: { minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Segoe UI', -apple-system, sans-serif" },
  nav: {
    background: "#0052CC", height: 56, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,52,140,0.3)",
  },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  logoWrap: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: {
    width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 16 },
  backBtn: {
    background: "rgba(255,255,255,0.15)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
    padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500,
  },
  main: { maxWidth: 900, margin: "0 auto", padding: "32px 24px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  breadcrumbLink: { fontSize: 14, color: "#0052CC", cursor: "pointer", fontWeight: 500 },
  breadcrumbSep: { color: "#6B778C", fontSize: 14 },
  breadcrumbCurrent: { fontSize: 14, color: "#6B778C" },
  card: {
    background: "#fff", borderRadius: 10, padding: "32px",
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
  },
  cardTop: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  cardIcon: { fontSize: 36 },
  cardTitle: { fontSize: 22, fontWeight: 700, color: "#172B4D", margin: "0 0 4px" },
  cardSubtitle: { fontSize: 14, color: "#6B778C", margin: 0 },
  memberCount: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "#F4F5F7", borderRadius: 8, padding: "10px 16px",
  },
  memberCountNum: { fontSize: 24, fontWeight: 700, color: "#0052CC" },
  memberCountLabel: { fontSize: 11, color: "#6B778C", textTransform: "uppercase", letterSpacing: 0.5 },
  warningBox: {
    background: "#FFFAE6", border: "1px solid #FFE380", borderRadius: 6,
    padding: "10px 14px", marginBottom: 16, color: "#172B4D",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  errorBox: {
    background: "#FFEBE6", border: "1px solid #FF8F73", borderRadius: 6,
    padding: "10px 14px", marginBottom: 16, color: "#BF2600",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  successBox: {
    background: "#E3FCEF", border: "1px solid #57D9A3", borderRadius: 6,
    padding: "10px 14px", marginBottom: 16, color: "#006644",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "60px 0" },
  spinner: {
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid #DFE1E6", borderTopColor: "#0052CC",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "48px 0" },
  table: { borderRadius: 8, overflow: "hidden", border: "1px solid #DFE1E6" },
  tableHeader: {
    display: "flex", background: "#F4F5F7",
    padding: "12px 16px", borderBottom: "1px solid #DFE1E6",
  },
  th: { fontSize: 12, fontWeight: 700, color: "#6B778C", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { display: "flex", padding: "14px 16px", borderBottom: "1px solid #F4F5F7", alignItems: "center" },
  td: { display: "flex", alignItems: "center" },
  memberInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%", color: "#fff",
    fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  memberName: { fontSize: 14, fontWeight: 600, color: "#172B4D", display: "flex", alignItems: "center", gap: 6 },
  youBadge: {
    fontSize: 11, background: "#DEEBFF", color: "#0052CC",
    borderRadius: 4, padding: "2px 6px", fontWeight: 600,
  },
  roleBadge: {
    fontSize: 12, fontWeight: 700, borderRadius: 4,
    padding: "3px 8px", letterSpacing: 0.3,
  },
  select: {
    padding: "6px 10px", borderRadius: 6, border: "2px solid #DFE1E6",
    fontSize: 13, color: "#172B4D", background: "#fff",
    cursor: "pointer", fontFamily: "inherit", outline: "none",
  },
};

export default ManageMembers;