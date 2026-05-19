import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userStories, setUserStories] = useState([]);
  const userId = localStorage.getItem("userId"); // Lấy ID của bạn sau khi đăng ký

  useEffect(() => {
    // API lấy danh sách User Story
    // axios.get('http://localhost:5000/api/userstories').then(res => setUserStories(res.data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Scrum Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            localStorage.clear();
            navigate("/register");
          }}
        >
          Đăng xuất
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cột trái: Danh sách User Stories (US-006) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Danh sách User Stories
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Nút test nhanh cho US-006 - Thay ID thật từ Postman vào đây */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2, justifyContent: "flex-start", p: 2 }}
              onClick={() => navigate("/userstory/cm...")}
            >
              📄 Xem chi tiết User Story mẫu (US-006)
            </Button>

            <Typography variant="body2" color="text.secondary">
              (Sau này các User Story sẽ tự động hiện ở đây)
            </Typography>
          </Paper>
        </Grid>

        {/* Cột phải: Quản lý dự án (US-039 & US-004) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom>
              Quản lý nhóm
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 2 }}>
              ID của bạn: <strong>{userId || "Chưa đăng nhập"}</strong>
            </Typography>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={() => alert("Tính năng thêm thành viên đang phát triển")}
            >
              + Thêm thành viên (US-039)
            </Button>
            {/* US-036: Tạo Project */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/create-project")}
            >
              ➕ Tạo Project (US-036)
            </Button>

            {/* US-005: Xem Backlog */}
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/backlog")}
            >
              📋 Xem Backlog (US-005)
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
