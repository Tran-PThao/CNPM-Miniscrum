import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get("http://localhost:5000/api/project", config);
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Không thể tải danh sách dự án.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const projectColors = ["#0052CC", "#00875A", "#FF5630", "#6554C0", "#FF8B00", "#00B8D9"];

  return (
    <div style={styles.page}>
      {/* Top Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#fff" opacity="0.9"/>
                <path d="M12 2L4 7l8 5 8-5-8-5z" fill="#fff"/>
              </svg>
            </div>
            <span style={styles.logoText}>Mini Scrum</span>
          </div>
          <div style={styles.navLinks}>
            <span style={styles.navLinkActive}>Dự án</span>
            <span style={styles.navLink} onClick={() => navigate("/backlog")}>Backlog</span>
          </div>
        </div>
        <div style={styles.navRight}>
          <div style={styles.avatar}>
            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Đăng xuất</button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Dự án của bạn</h1>
            <p style={styles.pageSubtitle}>Xin chào, <strong>{user.fullName || "bạn"}</strong>! Hôm nay bạn làm gì?</p>
          </div>
          <button style={styles.createBtn} onClick={() => navigate("/create-project")}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Tạo dự án mới
          </button>
        </div>

        {error && <div style={styles.errorBox}><span>⚠</span> {error}</div>}

        {loading ? (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <span style={{ color: "#6B778C", fontSize: 14 }}>Đang tải dự án...</span>
          </div>
        ) : projects.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>Chưa có dự án nào</h3>
            <p style={styles.emptyText}>Tạo dự án đầu tiên để bắt đầu quản lý sprint!</p>
            <button style={styles.createBtn} onClick={() => navigate("/create-project")}>
              + Tạo dự án mới
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map((project, idx) => {
              const color = projectColors[idx % projectColors.length];
              return (
                <div key={project.id} style={styles.card}>
                  <div style={{ ...styles.cardHeader, background: color }}>
                    <div style={styles.cardInitial}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={styles.cardType}>SOFTWARE</span>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{project.name}</h3>
                    <p style={styles.cardDesc}>{project.description || "Không có mô tả"}</p>
                    {project.goal && (
                      <div style={styles.cardGoal}>
                        <span style={styles.goalLabel}>Mục tiêu</span>
                        <span style={styles.goalText}>{project.goal}</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.cardFooter}>
                    <button
                      style={styles.footerBtn}
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                    >
                      ✏ Chỉnh sửa
                    </button>
                    <button
                      style={styles.footerBtn}
                      onClick={() => navigate(`/projects/${project.id}/members`)}
                    >
                      👥 Thành viên
                    </button>
                    <button
                      style={{ ...styles.footerBtn, color: "#0052CC" }}
                      onClick={() => navigate(`/backlog`)}
                    >
                      📋 Backlog
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#F4F5F7",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  nav: {
    background: "#0052CC", height: 56, display: "flex",
    alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,52,140,0.3)",
  },
  navLeft: { display: "flex", alignItems: "center", gap: 24 },
  logoWrap: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "-0.2px" },
  navLinks: { display: "flex", gap: 4 },
  navLinkActive: {
    color: "#fff", fontSize: 14, fontWeight: 600, padding: "6px 12px",
    background: "rgba(255,255,255,0.15)", borderRadius: 4, cursor: "pointer",
  },
  navLink: {
    color: "rgba(255,255,255,0.8)", fontSize: 14, padding: "6px 12px",
    borderRadius: 4, cursor: "pointer",
  },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #36B37E, #00875A)",
    color: "#fff", fontWeight: 700, fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.15)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
    padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500,
  },
  main: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 32,
  },
  pageTitle: { fontSize: 26, fontWeight: 700, color: "#172B4D", margin: "0 0 6px" },
  pageSubtitle: { fontSize: 14, color: "#6B778C", margin: 0 },
  createBtn: {
    display: "flex", alignItems: "center", gap: 8,
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    color: "#fff", border: "none", borderRadius: 6,
    padding: "10px 18px", fontSize: 14, fontWeight: 600,
    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,82,204,0.35)",
    whiteSpace: "nowrap",
  },
  errorBox: {
    background: "#FFEBE6", border: "1px solid #FF8F73", borderRadius: 8,
    padding: "12px 16px", marginBottom: 24, color: "#BF2600",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  loadingWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 16, padding: "80px 0",
  },
  spinner: {
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid #DFE1E6", borderTopColor: "#0052CC",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "80px 0", gap: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: "#172B4D", margin: 0 },
  emptyText: { fontSize: 14, color: "#6B778C", margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff", borderRadius: 10, overflow: "hidden",
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  },
  cardHeader: {
    height: 80, display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 16px",
  },
  cardInitial: {
    width: 44, height: 44, borderRadius: 8,
    background: "rgba(255,255,255,0.25)",
    color: "#fff", fontWeight: 800, fontSize: 22,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  cardType: {
    fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)",
    letterSpacing: 1, textTransform: "uppercase",
  },
  cardBody: { padding: "16px 18px" },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#172B4D", margin: "0 0 6px" },
  cardDesc: { fontSize: 13, color: "#6B778C", margin: "0 0 10px", lineHeight: 1.5 },
  cardGoal: {
    display: "flex", flexDirection: "column", gap: 2,
    background: "#F4F5F7", borderRadius: 6, padding: "8px 10px",
  },
  goalLabel: { fontSize: 11, fontWeight: 700, color: "#6B778C", textTransform: "uppercase", letterSpacing: 0.5 },
  goalText: { fontSize: 13, color: "#172B4D" },
  cardFooter: {
    display: "flex", borderTop: "1px solid #F4F5F7", padding: "8px 10px", gap: 4,
  },
  footerBtn: {
    flex: 1, background: "none", border: "none", cursor: "pointer",
    fontSize: 12, color: "#42526E", fontWeight: 500,
    padding: "6px 4px", borderRadius: 4, textAlign: "center",
    transition: "background 0.15s",
  },
};