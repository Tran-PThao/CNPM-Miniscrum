import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_STYLE = {
  TODO: { background: '#F4F5F7', color: '#42526E', border: '1px solid #DFE1E6' },
  IN_PROGRESS: { background: '#DEEBFF', color: '#0052CC', border: '1px solid #4C9AFF' },
  DONE: { background: '#E3FCEF', color: '#006644', border: '1px solid #57D9A3' },
};

export default function UserStoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/userstory/${id}`);
        setStory(res.data);
      } catch (err) {
        setError('Không tìm thấy User Story này hoặc server đang bận.');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) return (
    <div style={st.page}>
      <div style={st.loadingWrap}>
        <div style={st.spinner} />
        <span style={{ color: "#6B778C", fontSize: 14 }}>Đang tải...</span>
      </div>
    </div>
  );

  if (error) return (
    <div style={st.page}>
      <div style={st.errorWrap}>
        <div style={{ fontSize: 48 }}>😕</div>
        <h3 style={{ color: "#172B4D", margin: "12px 0 8px" }}>Không tìm thấy</h3>
        <p style={{ color: "#6B778C", fontSize: 14, margin: "0 0 20px" }}>{error}</p>
        <button style={st.backBtn2} onClick={() => navigate('/dashboard')}>← Quay về Dashboard</button>
      </div>
    </div>
  );

  const statusStyle = STATUS_STYLE[story.status] || STATUS_STYLE.TODO;

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
          <span style={st.breadcrumbLink} onClick={() => navigate('/backlog')}>Backlog</span>
          <span style={st.breadcrumbSep}>/</span>
          <span style={st.breadcrumbCurrent}>{story.title}</span>
        </div>

        <div style={st.card}>
          {/* Header */}
          <div style={st.cardHeader}>
            <span style={st.storyType}>📝 USER STORY</span>
            <div style={st.headerActions}>
              <span style={{ ...st.statusBadge, ...statusStyle }}>{story.status || 'TODO'}</span>
            </div>
          </div>

          <h1 style={st.storyTitle}>{story.title}</h1>

          <div style={st.divider} />

          {/* Meta info */}
          <div style={st.metaRow}>
            <div style={st.metaItem}>
              <span style={st.metaLabel}>Thuộc dự án</span>
              <span style={st.metaValue}>{story.project?.name || 'Đang cập nhật...'}</span>
            </div>
            <div style={st.metaItem}>
              <span style={st.metaLabel}>Story Points</span>
              <span style={{ ...st.metaValue, ...st.pointsBadge }}>
                {story.storyPoints ?? '—'}
              </span>
            </div>
            <div style={st.metaItem}>
              <span style={st.metaLabel}>Ưu tiên</span>
              <span style={st.metaValue}>{story.priority || 'MEDIUM'}</span>
            </div>
          </div>

          <div style={st.divider} />

          {/* Description */}
          <div style={st.section}>
            <h3 style={st.sectionTitle}>Mô tả</h3>
            <div style={st.descBox}>
              {story.description || <span style={{ color: '#6B778C', fontStyle: 'italic' }}>Không có mô tả chi tiết.</span>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const st = {
  page: { minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Segoe UI', -apple-system, sans-serif" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "120px 0" },
  errorWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "120px 0" },
  spinner: {
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid #DFE1E6", borderTopColor: "#0052CC",
    animation: "spin 0.8s linear infinite",
  },
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
  backBtn2: {
    padding: "10px 20px", borderRadius: 6, border: "none",
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  main: { maxWidth: 800, margin: "0 auto", padding: "32px 24px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  breadcrumbLink: { fontSize: 14, color: "#0052CC", cursor: "pointer", fontWeight: 500 },
  breadcrumbSep: { color: "#6B778C", fontSize: 14 },
  breadcrumbCurrent: { fontSize: 14, color: "#6B778C" },
  card: {
    background: "#fff", borderRadius: 10, padding: "32px",
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  storyType: { fontSize: 11, fontWeight: 700, color: "#6B778C", letterSpacing: 1 },
  headerActions: { display: "flex", gap: 8 },
  statusBadge: { fontSize: 12, fontWeight: 700, borderRadius: 4, padding: "4px 10px" },
  storyTitle: { fontSize: 26, fontWeight: 700, color: "#172B4D", margin: "0 0 24px", lineHeight: 1.3 },
  divider: { height: 1, background: "#DFE1E6", margin: "20px 0" },
  metaRow: { display: "flex", gap: 32, flexWrap: "wrap" },
  metaItem: { display: "flex", flexDirection: "column", gap: 4 },
  metaLabel: { fontSize: 11, fontWeight: 700, color: "#6B778C", textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 14, fontWeight: 600, color: "#172B4D" },
  pointsBadge: {
    background: "#DEEBFF", color: "#0052CC", borderRadius: 4,
    padding: "2px 8px", display: "inline-block", width: "fit-content",
  },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: "#172B4D", margin: "0 0 12px" },
  descBox: {
    background: "#F4F5F7", borderRadius: 8, padding: "16px",
    fontSize: 14, color: "#172B4D", lineHeight: 1.7,
  },
};