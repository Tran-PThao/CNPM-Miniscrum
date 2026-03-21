import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', goal: '' });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/project/${id}`);
        setFormData({ name: res.data.name || '', description: res.data.description || '', goal: res.data.goal || '' });
      } catch (err) {
        setError(err.response?.data?.error || 'Không thể tải thông tin dự án.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    const token = localStorage.getItem('token');
    if (!token) { setError('Bạn chưa đăng nhập hoặc phiên làm việc hết hạn.'); return; }
    setSubmitLoading(true);
    try {
      await axios.patch(`http://localhost:5000/api/project/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể lưu. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div style={st.page}>
      <div style={st.loadingWrap}>
        <div style={st.spinner} />
        <span style={{ color: "#6B778C", fontSize: 14 }}>Đang tải...</span>
      </div>
    </div>
  );

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
          <span style={st.breadcrumbCurrent}>Chỉnh sửa dự án</span>
        </div>

        <div style={st.card}>
          <div style={st.cardTop}>
            <div style={st.cardIcon}>✏️</div>
            <div>
              <h1 style={st.cardTitle}>Chỉnh sửa dự án</h1>
              <p style={st.cardSubtitle}>Cập nhật thông tin, mục tiêu hoặc mô tả dự án</p>
            </div>
          </div>

          {error && <div style={st.errorBox}><span>⚠</span> {error}</div>}
          {success && <div style={st.successBox}><span>✓</span> Cập nhật thành công! Đang chuyển hướng...</div>}

          <form onSubmit={handleSubmit} style={st.form}>
            <div style={st.fieldGroup}>
              <label style={st.label}>Tên dự án <span style={st.required}>*</span></label>
              <input
                name="name" value={formData.name} onChange={handleChange}
                style={st.input} required disabled={submitLoading}
              />
            </div>
            <div style={st.fieldGroup}>
              <label style={st.label}>Mô tả dự án</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                style={st.textarea} rows={4} disabled={submitLoading}
              />
            </div>
            <div style={st.fieldGroup}>
              <label style={st.label}>Mục tiêu (Goal)</label>
              <textarea
                name="goal" value={formData.goal} onChange={handleChange}
                style={st.textarea} rows={4} disabled={submitLoading}
              />
            </div>
            <div style={st.actions}>
              <button type="button" style={st.cancelBtn} onClick={() => navigate('/dashboard')}>Hủy</button>
              <button type="submit" style={{ ...st.submitBtn, opacity: submitLoading ? 0.7 : 1 }} disabled={submitLoading}>
                {submitLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const st = {
  page: { minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Segoe UI', -apple-system, sans-serif" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "120px 0" },
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
  main: { maxWidth: 680, margin: "0 auto", padding: "32px 24px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  breadcrumbLink: { fontSize: 14, color: "#0052CC", cursor: "pointer", fontWeight: 500 },
  breadcrumbSep: { color: "#6B778C", fontSize: 14 },
  breadcrumbCurrent: { fontSize: 14, color: "#6B778C" },
  card: {
    background: "#fff", borderRadius: 10, padding: "32px",
    boxShadow: "0 1px 4px rgba(9,30,66,0.1), 0 0 0 1px rgba(9,30,66,0.06)",
  },
  cardTop: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  cardIcon: { fontSize: 36 },
  cardTitle: { fontSize: 22, fontWeight: 700, color: "#172B4D", margin: "0 0 4px" },
  cardSubtitle: { fontSize: 14, color: "#6B778C", margin: 0 },
  errorBox: {
    background: "#FFEBE6", border: "1px solid #FF8F73", borderRadius: 6,
    padding: "10px 14px", marginBottom: 20, color: "#BF2600",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  successBox: {
    background: "#E3FCEF", border: "1px solid #57D9A3", borderRadius: 6,
    padding: "10px 14px", marginBottom: 20, color: "#006644",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#172B4D" },
  required: { color: "#FF5630" },
  input: {
    padding: "10px 12px", borderRadius: 6, border: "2px solid #DFE1E6",
    fontSize: 14, color: "#172B4D", outline: "none", fontFamily: "inherit",
  },
  textarea: {
    padding: "10px 12px", borderRadius: 6, border: "2px solid #DFE1E6",
    fontSize: 14, color: "#172B4D", outline: "none", fontFamily: "inherit",
    resize: "vertical", lineHeight: 1.5,
  },
  actions: { display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8 },
  cancelBtn: {
    padding: "10px 20px", borderRadius: 6, border: "2px solid #DFE1E6",
    background: "#fff", fontSize: 14, fontWeight: 600, color: "#42526E", cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 24px", borderRadius: 6, border: "none",
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,82,204,0.35)",
  },
};

export default EditProject;