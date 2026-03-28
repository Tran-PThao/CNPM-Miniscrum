import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/register`, form);
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      localStorage.setItem('userId', res.data.userId);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#fff" opacity="0.9"/>
              <path d="M12 2L4 7l8 5 8-5-8-5z" fill="#fff"/>
            </svg>
          </div>
          <span style={styles.logoText}>Mini Scrum</span>
        </div>

        <h1 style={styles.title}>Tạo tài khoản mới</h1>
        <p style={styles.subtitle}>Bắt đầu quản lý sprint của bạn ngay hôm nay.</p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}
        {success && (
          <div style={styles.successBox}>
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Họ và tên</label>
            <input
              name="fullName" placeholder="Nguyễn Văn A"
              value={form.fullName} onChange={handleChange}
              style={styles.input} required disabled={loading}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={styles.input} required disabled={loading}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              type="password" name="password" placeholder="Tối thiểu 6 ký tự"
              value={form.password} onChange={handleChange}
              style={styles.input} required disabled={loading}
            />
          </div>
          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div style={styles.divider}><span style={styles.dividerText}>hoặc</span></div>

        <p style={styles.loginText}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={styles.link}>Đăng nhập</Link>
        </p>
      </div>
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#F4F5F7',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative', overflow: 'hidden',
  },
  bgBlob1: {
    position: 'fixed', top: -120, right: -120, width: 400, height: 400,
    borderRadius: '50%', background: 'radial-gradient(circle, #0052CC22, transparent 70%)',
    pointerEvents: 'none',
  },
  bgBlob2: {
    position: 'fixed', bottom: -100, left: -100, width: 350, height: 350,
    borderRadius: '50%', background: 'radial-gradient(circle, #0065FF22, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#fff', borderRadius: 12, padding: '48px 40px',
    width: '100%', maxWidth: 400,
    boxShadow: '0 4px 24px rgba(9,30,66,0.12), 0 0 0 1px rgba(9,30,66,0.06)',
    position: 'relative', zIndex: 1,
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 28, justifyContent: 'center',
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: 'linear-gradient(135deg, #0052CC, #0065FF)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,82,204,0.4)',
  },
  logoText: { fontSize: 20, fontWeight: 700, color: '#0052CC', letterSpacing: '-0.3px' },
  title: { fontSize: 22, fontWeight: 700, color: '#172B4D', margin: '0 0 8px', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6B778C', textAlign: 'center', margin: '0 0 28px' },
  errorBox: {
    background: '#FFEBE6', border: '1px solid #FF8F73', borderRadius: 6,
    padding: '10px 14px', marginBottom: 20, color: '#BF2600',
    fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
  },
  successBox: {
    background: '#E3FCEF', border: '1px solid #57D9A3', borderRadius: 6,
    padding: '10px 14px', marginBottom: 20, color: '#006644',
    fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#172B4D' },
  input: {
    padding: '10px 12px', borderRadius: 6, border: '2px solid #DFE1E6',
    fontSize: 14, color: '#172B4D', outline: 'none', fontFamily: 'inherit',
  },
  btn: {
    marginTop: 8, padding: '11px 16px',
    background: 'linear-gradient(135deg, #0052CC, #0065FF)',
    color: '#fff', border: 'none', borderRadius: 6,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,82,204,0.35)',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0 0', borderTop: '1px solid #DFE1E6', position: 'relative',
  },
  dividerText: {
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
    top: -10, background: '#fff', padding: '0 10px', fontSize: 13, color: '#6B778C',
  },
  loginText: { textAlign: 'center', fontSize: 14, color: '#6B778C', margin: '20px 0 0' },
  link: { color: '#0052CC', fontWeight: 600, textDecoration: 'none' },
};
