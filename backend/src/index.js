const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

console.log("Backend Mini Scrum Management System - Sprint 1 đang chạy...");

// Test server
app.get('/', (req, res) => {
  res.json({ message: "Backend Sprint 1 đang chạy.." });
});

// US-001: ĐĂNG KÝ 
app.post('/api/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { email, password: hashed, fullName } 
    });
    res.status(201).json({ message: "Đăng ký thành công!", userId: user.id });
  } catch (err) {
    res.status(400).json({ error: "Email đã tồn tại hoặc dữ liệu không hợp lệ" });
  }
});

// TẠO PROJECT (Hỗ trợ test & Setup)
app.post('/api/project', async (req, res) => {
  const { name, description, goal } = req.body;
  try {
    const project = await prisma.project.create({ 
      data: { name, description, goal } 
    });
    res.json({ message: "Tạo Project thành công", projectId: project.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo dự án" });
  }
});

//US-039 & US-004: THÊM THÀNH VIÊN + PHÂN QUYỀN
// API này cho phép thêm người vào dự án, nhưng kiểm tra xem người thực hiện có quyền PO không
app.post('/api/project/:projectId/members', async (req, res) => {
  const { projectId } = req.params;
  const { userId, role, requesterId } = req.body; 

  try {
    // 1. Kiểm tra người thực hiện (requesterId) có phải là PO của dự án này không
    const requester = await prisma.projectMember.findUnique({
      where: { 
        userId_projectId: { userId: requesterId, projectId } 
      }
    });

    // Nếu không tìm thấy requester hoặc requester không phải PO
    if (!requester || requester.role !== 'PO') {
      return res.status(403).json({ error: "Chỉ Product Owner (PO) mới có quyền thêm thành viên!" });
    }

    // 2. Nếu là PO, thực hiện thêm thành viên mới
    const member = await prisma.projectMember.create({ 
      data: { userId, projectId, role } 
    });
    
    res.json({ message: "Thêm thành viên thành công", member });
  } catch (err) {
    res.status(400).json({ error: "Lỗi: Thành viên đã tồn tại trong dự án hoặc dữ liệu sai" });
  }
});

// TẠO USER STORY (Hỗ trợ test US-006)
app.post('/api/userstory', async (req, res) => {
  const { title, description, projectId } = req.body;
  try {
    const story = await prisma.userStory.create({ 
      data: { title, description, projectId } 
    });
    res.json({ message: "Tạo User Story thành công", storyId: story.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo User Story" });
  }
});

// US-006: XEM CHI TIẾT USER STORY
app.get('/api/userstory/:id', async (req, res) => {
  try {
    const story = await prisma.userStory.findUnique({
      where: { id: req.params.id },
      include: { project: true } // Lấy kèm thông tin dự án
    });
    
    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy User Story" });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});