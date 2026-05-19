import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Divider, Button, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios'; // Gọi trực tiếp axios 

export default function UserStoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        // Thay đổi URL cho khớp với Backend đã sửa
        const res = await axios.get(`http://localhost:5000/api/userstory/${id}`);
        setStory(res.data);
      } catch (err) {
        console.error('Lỗi load User Story', err);
        setError('Không tìm thấy User Story này hoặc server đang bận.');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
    </Box>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
      <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Quay lại Dashboard</Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>← Quay lại Dashboard</Button>
      
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
            User Story Detail
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
            {story.title}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1">
              <strong>📝 Mô tả:</strong> 
              <Box component="span" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                {story.description || 'Không có mô tả chi tiết.'}
              </Box>
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
              <Typography variant="body2">
                <strong>📌 Trạng thái:</strong> {story.status || 'TODO'}
              </Typography>
              <Typography variant="body2">
                <strong>🔥 Ưu tiên:</strong> {story.priority || 'MEDIUM'}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1 }}>
              <strong>📂 Thuộc dự án:</strong> {story.project?.name || 'Đang cập nhật...'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}