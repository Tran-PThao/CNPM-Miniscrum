const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
// Middleware auth (dùng cho tất cả route cần quyền)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mini_scrum_secret");
    req.user = decoded; // { userId, email, role }
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};

console.log("Backend Mini Scrum Management System - Sprint 1 đang chạy...");

// Test server
app.get("/", (req, res) => {
  res.json({ message: "Backend Sprint 1 đang chạy.." });
});

// US-001: ĐĂNG KÝ
app.post("/api/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, fullName },
    });
    res.status(201).json({ message: "Đăng ký thành công!", userId: user.id });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Email đã tồn tại hoặc dữ liệu không hợp lệ" });
  }
});
// US-002: ĐĂNG NHẬP
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "mini_scrum_secret",
      { expiresIn: "1d" },
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi đăng nhập" });
  }
});
// LẤY DANH SÁCH PROJECT
app.get("/api/project", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách dự án" });
  }
});
// Mục đích: Để trang EditProject.jsx có thể "đổ" dữ liệu cũ vào các ô nhập liệu
app.get("/api/project/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: id }, // Lưu ý: nếu trong schema.prisma là project_id thì sửa id thành project_id
    });

    if (!project) {
      return res.status(404).json({ error: "Không tìm thấy Project" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết dự án" });
  }
});

// TẠO PROJECT (Hỗ trợ test & Setup)
app.post("/api/project", async (req, res) => {
  const { name, description, goal } = req.body;
  try {
    const project = await prisma.project.create({
      data: { name, description, goal },
    });
    res.json({ message: "Tạo Project thành công", projectId: project.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo dự án" });
  }
});

//US-039 & US-004: THÊM THÀNH VIÊN + PHÂN QUYỀN
// API này cho phép thêm người vào dự án, nhưng kiểm tra xem người thực hiện có quyền PO không
app.post("/api/project/:projectId/members", async (req, res) => {
  const { projectId } = req.params;
  const { userId, role, requesterId } = req.body;

  try {
    // 1. Kiểm tra người thực hiện (requesterId) có phải là PO của dự án này không
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: requesterId, projectId },
      },
    });

    // Nếu không tìm thấy requester hoặc requester không phải PO
    if (!requester || requester.role !== "PO") {
      return res.status(403).json({
        error: "Chỉ Product Owner (PO) mới có quyền thêm thành viên!",
      });
    }

    // 2. Nếu là PO, thực hiện thêm thành viên mới
    const member = await prisma.projectMember.create({
      data: { userId, projectId, role },
    });

    res.json({ message: "Thêm thành viên thành công", member });
  } catch (err) {
    res.status(400).json({
      error: "Lỗi: Thành viên đã tồn tại trong dự án hoặc dữ liệu sai",
    });
  }
});

// TẠO USER STORY (Hỗ trợ test US-006)
app.post("/api/userstory", async (req, res) => {
  const { title, description, projectId } = req.body;
  try {
    const story = await prisma.userStory.create({
      data: { title, description, projectId },
    });
    res.json({ message: "Tạo User Story thành công", storyId: story.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo User Story" });
  }
});

// US-006: XEM CHI TIẾT USER STORY
app.get("/api/userstory/:id", async (req, res) => {
  try {
    const story = await prisma.userStory.findUnique({
      where: { id: req.params.id },
      include: { project: true }, // Lấy kèm thông tin dự án
    });

    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy User Story" });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});
// US-005: XEM DANH SÁCH USER STORIES TRONG PRODUCT BACKLOG
app.get("/api/project/:projectId/userstories", async (req, res) => {
  const { projectId } = req.params;

  try {
    const stories = await prisma.userStory.findMany({
      where: { projectId },
      orderBy: { title: "asc" },
    });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách User Stories" });
  }
});
// US-037: CHỈNH SỬA THÔNG TIN PROJECT (name, description, goal)
// Chỉ Product Owner (PO) mới được phép chỉnh sửa
app.patch("/api/project/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, goal } = req.body;

  try {
    console.log("Đang xử lý update cho ID:", id); // Xem log ở terminal backend

    const updatedProject = await prisma.project.update({
      where: { id: id }, // Đảm bảo trường này là 'id' như trong schema.prisma của bạn[cite: 1]
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        goal: goal !== undefined ? goal : undefined,
      },
    });

    console.log("Update thành công!");
    return res.json({ message: "Thành công", project: updatedProject });

  } catch (err) {
    console.error("Lỗi Prisma:", err.message);
    return res.status(500).json({ error: "Lỗi kết nối Database hoặc ID không tồn tại" });
  }
});
// US-040: LẤY DANH SÁCH THÀNH VIÊN CỦA PROJECT
app.get("/api/project/:projectId/members", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, email: true, fullName: true } } },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách thành viên" });
  }
});

// US-040: CẬP NHẬT ROLE CỦA THÀNH VIÊN
app.patch("/api/project/:projectId/members/:userId/role", authMiddleware, async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;
  const requesterId = req.user.userId;

  try {
    const requester = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: requesterId, projectId } },
    });

    if (!requester || requester.role !== "PO") {
      return res.status(403).json({ error: "Chỉ PO mới được phân quyền!" });
    }

    if (requesterId === userId) {
      return res.status(400).json({ error: "Không thể đổi role của chính mình!" });
    }

    const updated = await prisma.projectMember.update({
      where: { userId_projectId: { userId, projectId } },
      data: { role },
    });

    res.json({ message: "Cập nhật role thành công", member: updated });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi cập nhật role" });
  }
});
// SEED: Thêm member đầu tiên không cần kiểm tra quyền
app.post("/api/project/:projectId/members/seed", async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  try {
    const member = await prisma.projectMember.create({
      data: { userId, projectId, role },
    });
    res.json({ message: "Thêm thành công", member });
  } catch (err) {
    res.status(400).json({ error: "Thành viên đã tồn tại hoặc dữ liệu sai" });
  }
});
// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
