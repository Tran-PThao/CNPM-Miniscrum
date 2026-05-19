import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userStories, setUserStories] = useState([]);
  const userId = localStorage.getItem("userId") || JSON.parse(localStorage.getItem("user") || "{}").id;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ projectId: "", memberId: "", role: "MEMBER" });
  const [addMemberError, setAddMemberError] = useState("");
  const [addMemberSuccess, setAddMemberSuccess] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  useEffect(() => {
    // API lấy danh sách User Story
    // axios.get('http://localhost:5000/api/userstories').then(res => setUserStories(res.data));
  }, []);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAddMember = async () => {
    setAddMemberError("");
    setAddMemberSuccess("");
    if (!addMemberForm.projectId || !addMemberForm.memberId) {
      setAddMemberError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setAddMemberLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/project/${addMemberForm.projectId}/members`,
        {
          userId: addMemberForm.memberId,
          role: addMemberForm.role,
          requesterId: userId,
        }
      );
      setAddMemberSuccess(res.data.message || "Thêm thành viên thành công!");
      setAddMemberForm({ projectId: "", memberId: "", role: "MEMBER" });
    } catch (err) {
      setAddMemberError(
        err.response?.data?.error || "Lỗi khi thêm thành viên."
      );
    } finally {
      setAddMemberLoading(false);
    }
  };

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
          onClick={handleLogout}
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
              onClick={() => setShowAddMemberModal(true)}
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

      {/* Logout Confirmation Modal */}
      <Dialog
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          {"Đăng xuất"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Bạn có chắc muốn đăng xuất khỏi hệ thống không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutModal(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmLogout} color="error" autoFocus>
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog (US-039 & US-004) */}
      <Dialog
        open={showAddMemberModal}
        onClose={() => {
          setShowAddMemberModal(false);
          setAddMemberError("");
          setAddMemberSuccess("");
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Thêm thành viên vào dự án</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Nhập thông tin bên dưới để thêm thành viên và phân quyền trong dự án (chỉ PO mới có quyền thực hiện).
          </DialogContentText>
          {addMemberError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addMemberError}
            </Alert>
          )}
          {addMemberSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {addMemberSuccess}
            </Alert>
          )}
          <TextField
            margin="dense"
            label="Mã dự án (Project ID)"
            fullWidth
            value={addMemberForm.projectId}
            onChange={(e) => setAddMemberForm({ ...addMemberForm, projectId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mã thành viên (User ID)"
            fullWidth
            value={addMemberForm.memberId}
            onChange={(e) => setAddMemberForm({ ...addMemberForm, memberId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Vai trò (Role)</InputLabel>
            <Select
              labelId="role-select-label"
              value={addMemberForm.role}
              label="Vai trò (Role)"
              onChange={(e) => setAddMemberForm({ ...addMemberForm, role: e.target.value })}
            >
              <MenuItem value="PO">Product Owner (PO)</MenuItem>
              <MenuItem value="SM">Scrum Master (SM)</MenuItem>
              <MenuItem value="MEMBER">Member (Dev)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMemberModal(false)} disabled={addMemberLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleAddMember}
            color="success"
            variant="contained"
            disabled={addMemberLoading}
          >
            {addMemberLoading ? "Đang xử lý..." : "Thêm thành viên"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
