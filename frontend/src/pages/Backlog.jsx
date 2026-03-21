import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  TODO: { background: '#F4F5F7', color: '#42526E', border: '1px solid #DFE1E6' },
  IN_PROGRESS: { background: '#DEEBFF', color: '#0052CC', border: '1px solid #4C9AFF' },
  DONE: { background: '#E3FCEF', color: '#006644', border: '1px solid #57D9A3' },
};

function Backlog() {
  const [projectId, setProjectId] = useState("");
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoadStories = async () => {
    if (!projectId) { setMessage("Vui lòng nhập Project ID"); return; }
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/project/${projectId}/userstories`);
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Không tải được backlog"); return; }
      setStories(data);
      if (data.length === 0) setMessage("Dự án này chưa có User Story nào.");
    } catch {
      setMessage("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

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
        <button style={st.backBtn} onClick={() => navigate("/dashboard")}>← Quay về Dashboard</button>
      </nav>

      <main style={st.main}>
        <div style={st.breadcrumb}>
          <span style={st.breadcrumbLink} onClick={() => navigate("/dashboard")}>Dự án</span>
          <span style={st.breadcrumbSep}>/</span>
          <span style={st.breadcrumbCurrent}>Product Backlog</span>
        </div>

        <div style={st.header}>
          <div>
            <h1 style={st.pageTitle}>Product Backlog</h1>
            <p style={st.pageSubtitle}>Danh sách tất cả User Stories của dự án</p>
          </div>
        </div>

        {/* Search bar */}
        <div style={st.searchCard}>
          <div style={st.searchWrap}>
            <input
              type="text"
              placeholder="Nhập Project ID để xem backlog..."
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              style={st.searchInput}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadStories()}
            />
            <button
              onClick={handleLoadStories}
              style={{ ...st.searchBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Xem Backlog"}
            </button>
          </div>
        </div>

        {message && (
          <div style={st.infoBox}><span>ℹ</span> {message}</div>
        )}

        {stories.length > 0 && (
          <div style={st.tableCard}>
            <div style={st.tableHeader}>
              <span style={st.tableTitle}>
                {stories.length} User {stories.length === 1 ? 'Story' : 'Stories'}
              </span>
            </div>
            <div style={st.table}>
              <div style={st.thead}>
                <div style={{ ...st.th, flex: 3 }}>Tiêu đề</div>
                <div style={{ ...st.th, flex: 3 }}>Mô tả</div>
                <div style={{ ...st.th, flex: 1 }}>Trạng thái</div>
                <div style={{ ...st.th, flex: 1 }}>Story Points</div>
                <div style={{ ...st.th, flex: 1 }}>Chi tiết</div>
              </div>
              {stories.map((story, idx) => (
                <div key={story.id} style={{ ...st.trow, background: idx % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <div style={{ ...st.td, flex: 3, fontWeight: 600, color: '#172B4D' }}>
                    {story.title}
                  </div>
                  <div style={{ ...st.td, flex: 3, color: '#6B778C', fontSize: 13 }}>
                    {story.description || '—'}
                  </div>
                  <div style={{ ...st.td, flex: 1 }}>
                    <span style={{ ...st.badge, ...(STATUS_STYLE[story.status] || STATUS_STYLE.TODO) }}>
                      {story.status}
                    </span>
                  </div>
                  <div style={{ ...st.td, flex: 1, color: '#42526E', fontWeight: 600 }}>
                    {story.storyPoints ?? <span style={{ color: '#DFE1E6' }}>—</span>}
                  </div>
                  <div style={{ ...st.td, flex: 1 }}>
                    <button
                      style={st.detailBtn}
                      onClick={() => navigate(`/userstory/${story.id}`)}
                    >
                      Xem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
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
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  breadcrumbLink: { fontSize: 14, color: "#0052CC", cursor: "pointer", fontWeight: 500 },
  breadcrumbSep: { color: "#6B778C", fontSize: 14 },
  breadcrumbCurrent: { fontSize: 14, color: "#6B778C" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: 700, color: "#172B4D", margin: "0 0 6px" },
  pageSubtitle: { fontSize: 14, color: "#6B778C", margin: 0 },
  searchCard: {
    background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 20,
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
  },
  searchWrap: { display: "flex", gap: 12 },
  searchInput: {
    flex: 1, padding: "10px 14px", borderRadius: 6, border: "2px solid #DFE1E6",
    fontSize: 14, color: "#172B4D", outline: "none", fontFamily: "inherit",
  },
  searchBtn: {
    padding: "10px 24px", borderRadius: 6, border: "none",
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,82,204,0.35)", whiteSpace: "nowrap",
  },
  infoBox: {
    background: "#DEEBFF", border: "1px solid #4C9AFF", borderRadius: 6,
    padding: "10px 14px", marginBottom: 16, color: "#0052CC",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  tableCard: {
    background: "#fff", borderRadius: 10, overflow: "hidden",
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
  },
  tableHeader: {
    padding: "16px 20px", borderBottom: "1px solid #DFE1E6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  tableTitle: { fontSize: 15, fontWeight: 700, color: "#172B4D" },
  table: {},
  thead: {
    display: "flex", padding: "10px 20px", background: "#F4F5F7",
    borderBottom: "1px solid #DFE1E6",
  },
  th: { fontSize: 12, fontWeight: 700, color: "#6B778C", textTransform: "uppercase", letterSpacing: 0.5 },
  trow: {
    display: "flex", padding: "14px 20px",
    borderBottom: "1px solid #F4F5F7", alignItems: "center",
  },
  td: { display: "flex", alignItems: "center", paddingRight: 12 },
  badge: { fontSize: 12, fontWeight: 600, borderRadius: 4, padding: "3px 8px" },
  detailBtn: {
    padding: "5px 14px", borderRadius: 4, border: "2px solid #DFE1E6",
    background: "#fff", fontSize: 13, fontWeight: 600, color: "#0052CC",
    cursor: "pointer",
  },
};

export default Backlog;