import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const [form, setForm] = useState({ name: "", description: "", goal: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");
    try {
      const res = await fetch("http://192.168.1.6:5000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Tạo project thất bại"); return; }
      setMessage("Tạo dự án thành công!");
      setForm({ name: "", description: "", goal: "" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.logoWrap}>
            <div style={s.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#fff" opacity="0.9"/>
                <path d="M12 2L4 7l8 5 8-5-8-5z" fill="#fff"/>
              </svg>
            </div>
            <span style={s.logoText}>Mini Scrum</span>
          </div>
        </div>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Quay về Dashboard</button>
      </nav>

      <main style={s.main}>
        <div style={s.breadcrumb}>
          <span style={s.breadcrumbLink} onClick={() => navigate("/dashboard")}>Dự án</span>
          <span style={s.breadcrumbSep}>/</span>
          <span style={s.breadcrumbCurrent}>Tạo dự án mới</span>
        </div>

        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.cardIcon}>📋</div>
            <div>
              <h1 style={s.cardTitle}>Tạo dự án mới</h1>
              <p style={s.cardSubtitle}>Điền thông tin để khởi tạo dự án Scrum của bạn</p>
            </div>
          </div>

          {error && <div style={s.errorBox}><span>⚠</span> {error}</div>}
          {message && <div style={s.successBox}><span>✓</span> {message}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Tên dự án <span style={s.required}>*</span></label>
              <input
                name="name" placeholder="VD: Mini Scrum Management System"
                value={form.name} onChange={handleChange}
                style={s.input} required disabled={loading}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Mô tả dự án</label>
              <textarea
                name="description" placeholder="Mô tả ngắn về dự án..."
                value={form.description} onChange={handleChange}
                style={s.textarea} rows={3} disabled={loading}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Mục tiêu (Goal)</label>
              <textarea
                name="goal" placeholder="Mục tiêu cần đạt được..."
                value={form.goal} onChange={handleChange}
                style={s.textarea} rows={3} disabled={loading}
              />
            </div>
            <div style={s.actions}>
              <button type="button" style={s.cancelBtn} onClick={() => navigate("/dashboard")}>Hủy</button>
              <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo dự án"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

const s = {
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

export default CreateProject;
