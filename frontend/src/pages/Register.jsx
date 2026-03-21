import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, 
  Button, Alert, Paper, Link as MuiLink 
} from '@mui/material';
import axios from 'axios'; 

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Gọi trực tiếp đến cổng 5000 của Backend
      const res = await axios.post('http://localhost:5000/api/register', form);
      
      // US-001: Thông báo đăng ký thành công
      setSuccess('Đăng ký thành công! Đang chuyển hướng đến Dashboard...');
      
      // Lưu lại userId vào localStorage để dùng cho US-039 (làm requesterId)
      localStorage.setItem('userId', res.data.userId);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      // Hiển thị lỗi từ backend (ví dụ: Email đã tồn tại)
      setError(err.response?.data?.error || 'Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Mini Scrum
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Tạo tài khoản Sprint 1
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth label="Họ và tên" name="fullName"
              value={form.fullName} onChange={handleChange} autoFocus
              disabled={loading}
            />
            <TextField
              margin="normal" required fullWidth label="Địa chỉ Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal" required fullWidth label="Mật khẩu" name="password" type="password"
              value={form.password} onChange={handleChange}
              disabled={loading}
            />
            <Button 
              type="submit" fullWidth variant="contained" 
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2">
                Đã có tài khoản?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Đăng nhập
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}