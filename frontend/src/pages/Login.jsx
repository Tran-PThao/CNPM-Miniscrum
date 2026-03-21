import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Đăng nhập thất bại"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setMessage("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#fff" opacity="0.9"/>
              <path d="M12 2L4 7l8 5 8-5-8-5z" fill="#fff"/>
            </svg>
          </div>
          <span style={styles.logoText}>Mini Scrum</span>
        </div>

        <h1 style={styles.title}>Đăng nhập vào tài khoản</h1>
        <p style={styles.subtitle}>Chào mừng trở lại! Hãy tiếp tục sprint của bạn.</p>

        {message && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠</span> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={styles.input} required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              style={styles.input} required
            />
          </div>
          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div style={styles.divider}><span style={styles.dividerText}>hoặc</span></div>

        <p style={styles.registerText}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={styles.link}>Đăng ký miễn phí</Link>
        </p>
      </div>

      {/* Background decoration */}
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F5F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgBlob1: {
    position: "fixed", top: -120, right: -120,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, #0052CC22, transparent 70%)",
    pointerEvents: "none",
  },
  bgBlob2: {
    position: "fixed", bottom: -100, left: -100,
    width: 350, height: 350, borderRadius: "50%",
    background: "radial-gradient(circle, #0065FF22, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(9,30,66,0.12), 0 0 0 1px rgba(9,30,66,0.06)",
    position: "relative",
    zIndex: 1,
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 28, justifyContent: "center",
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,82,204,0.4)",
  },
  logoText: {
    fontSize: 20, fontWeight: 700, color: "#0052CC", letterSpacing: "-0.3px",
  },
  title: {
    fontSize: 22, fontWeight: 700, color: "#172B4D",
    margin: "0 0 8px", textAlign: "center",
  },
  subtitle: {
    fontSize: 14, color: "#6B778C", textAlign: "center", margin: "0 0 28px",
  },
  errorBox: {
    background: "#FFEBE6", border: "1px solid #FF8F73",
    borderRadius: 6, padding: "10px 14px", marginBottom: 20,
    color: "#BF2600", fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  errorIcon: { fontSize: 16 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#172B4D" },
  input: {
    padding: "10px 12px", borderRadius: 6,
    border: "2px solid #DFE1E6", fontSize: 14, color: "#172B4D",
    outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit",
    onFocus: { borderColor: "#0052CC" },
  },
  btn: {
    marginTop: 8, padding: "11px 16px",
    background: "linear-gradient(135deg, #0052CC, #0065FF)",
    color: "#fff", border: "none", borderRadius: 6,
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    transition: "transform 0.1s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(0,82,204,0.35)",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12, margin: "24px 0",
    borderTop: "1px solid #DFE1E6", paddingTop: 0, position: "relative",
  },
  dividerText: {
    position: "absolute", left: "50%", transform: "translateX(-50%)",
    top: -10, background: "#fff", padding: "0 10px",
    fontSize: 13, color: "#6B778C",
  },
  registerText: { textAlign: "center", fontSize: 14, color: "#6B778C", margin: 0 },
  link: { color: "#0052CC", fontWeight: 600, textDecoration: "none" },
};

export default Login;