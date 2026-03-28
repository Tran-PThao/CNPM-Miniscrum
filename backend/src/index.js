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

console.log("🚀 Backend Mini Scrum Management System - Sprint 1 đang chạy...");

// Test server
app.get("/", (req, res) => {
  res.json({ message: "Backend Sprint 1 đang chạy tốt!" });
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

// US-002: ĐĂNG NHẬP (từ code 2, đơn giản hơn nhưng giữ đầy đủ)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mini_scrum_secret",
      { expiresIn: "1d" }
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

// US-036: LẤY DANH SÁCH PROJECT (Chỉ lấy các project user tham gia)
app.get("/api/project", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId, status: "ACCEPTED" }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách dự án" });
  }
});

// US-039: TÌM KIẾM NGƯỜI DÙNG (Để gợi ý khi mời)
app.get("/api/users/search", authMiddleware, async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 2) return res.json([]);
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query } },
          { fullName: { contains: query } }
        ]
      },
      select: { id: true, email: true, fullName: true },
      take: 10
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Lỗi tìm kiếm người dùng" });
  }
});

// US-039: MỜI THÀNH VIÊN VÀO PROJECT (Sử dụng mời thông minh)
app.post("/api/project/:projectId/invite", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { userId, role = "MEMBER" } = req.body;
  const requesterId = req.user.userId;

  try {
    // Kiểm tra requester có phải PO không
    const requester = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: requesterId, projectId } },
    });

    if (!requester || requester.role !== "PO") {
      return res.status(403).json({ error: "Chỉ Product Owner (PO) mới có quyền mời thành viên!" });
    }

    // Mời thành viên với trạng thái PENDING (dùng upsert để reset nếu họ đã từng ở trong dự án)
    const member = await prisma.projectMember.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: { status: "PENDING", role },
      create: { userId, projectId, role, status: "PENDING" },
    });
    res.json({ message: "Đã gửi lời mời tham gia dự án!", member });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi gửi lời mời: " + err.message });
  }
});

// US-040: LẤY DANH SÁCH LỜI MỜI ĐANG CHỜ
app.get("/api/invitations", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const invitations = await prisma.projectMember.findMany({
      where: { userId, status: "PENDING" },
      include: {
        project: {
          select: { name: true, key: true }
        }
      }
    });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy lời mời" });
  }
});

// US-041: PHẢN HỒI LỜI MỜI (ACCEPT / DECLINE)
app.post("/api/invitations/:id/respond", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "ACCEPT" or "DECLINE"
  const userId = req.user.userId;

  try {
    const invitation = await prisma.projectMember.findFirst({
      where: { id, userId }
    });

    if (!invitation) return res.status(404).json({ error: "Không tìm thấy lời mời" });

    if (action === "ACCEPT") {
      await prisma.projectMember.update({
        where: { id },
        data: { status: "ACCEPTED" }
      });
      res.json({ message: "Chào mừng! Bạn đã tham gia dự án." });
    } else {
      // Decline = Xóa luôn theo yêu cầu của User
      await prisma.projectMember.delete({ where: { id } });
      res.json({ message: "Đã từ chối lời mời." });
    }
  } catch (err) {
    res.status(500).json({ error: "Lỗi phản hồi lời mời" });
  }
});

// Chi tiết Project (đổ dữ liệu cũ cho EditProject)
app.get("/api/project/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return res.status(404).json({ error: "Không tìm thấy Project" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết dự án" });
  }
});

// TẠO PROJECT (US-036)
app.post("/api/project", authMiddleware, async (req, res) => {
  const { name, description, goal } = req.body;
  const userId = req.user.userId;

  try {
    const project = await prisma.project.create({
      data: { name, description, goal },
    });

    // Tự động gán người tạo làm Product Owner (PO)
    await prisma.projectMember.create({
      data: { userId, projectId: project.id, role: "PO" }
    });

    res.json({ message: "Tạo Project thành công", projectId: project.id });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo dự án: " + err.message });
  }
});

// US-039 & US-004: THÊM THÀNH VIÊN + PHÂN QUYỀN (giữ logic kiểm tra PO từ code 1)
app.post("/api/project/:projectId/members", async (req, res) => {
  const { projectId } = req.params;
  const { userId, role = "MEMBER", requesterId } = req.body;

  try {
    // Kiểm tra requester có phải PO không
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId: requesterId, projectId },
      },
    });

    if (!requester || requester.role !== "PO") {
      return res.status(403).json({
        error: "Chỉ Product Owner (PO) mới có quyền thêm thành viên!",
      });
    }

    // Mời/Thêm thành viên với trạng thái PENDING (dùng upsert để xử lý nếu đã tồn tại nhưng chưa vào)
    const member = await prisma.projectMember.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: { status: "PENDING", role },
      create: { userId, projectId, role, status: "PENDING" },
    });
    res.json({ message: "Đã gửi yêu cầu tham gia dự án!", member });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Không thể mời thành viên. Lỗi: " + err.message,
    });
  }
});

// Helper kiểm tra quyền PO hoặc SM trong dự án (chỉ khi đã chấp nhận lời mời)
const checkPOorSM = async (userId, projectId) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return member && (member.role === "PO" || member.role === "SM") && member.status === "ACCEPTED";
};

// TẠO USER STORY
app.post("/api/userstory", authMiddleware, async (req, res) => {
  const { title, description, projectId, priority, assigneeId, storyPoints } = req.body;
  try {
    const hasPermission = await checkPOorSM(req.user.userId, projectId);
    if (!hasPermission) {
      return res.status(403).json({ error: "Chỉ Product Owner hoặc Scrum Master mới có quyền tạo User Story." });
    }

    const story = await prisma.userStory.create({
      data: { title, description, projectId, priority, assigneeId, storyPoints: parseInt(storyPoints) || null },
    });
    res.json({ message: "Tạo User Story thành công", story });
  } catch (err) {
    res.status(400).json({ error: "Lỗi khi tạo User Story" });
  }
});

// XÓA USER STORY
app.delete("/api/userstory/:id", authMiddleware, async (req, res) => {
  try {
    const story = await prisma.userStory.findUnique({ where: { id: req.params.id } });
    if (!story) return res.status(404).json({ error: "Không tìm thấy User Story" });

    const hasPermission = await checkPOorSM(req.user.userId, story.projectId);
    if (!hasPermission) {
      return res.status(403).json({ error: "Chỉ Product Owner hoặc Scrum Master mới có quyền xóa User Story." });
    }

    await prisma.userStory.delete({ where: { id: req.params.id } });
    res.json({ message: "Xóa User Story thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xóa User Story" });
  }
});

// CẬP NHẬT USER STORY
app.patch("/api/userstory/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assigneeId, storyPoints } = req.body;
  try {
    const story = await prisma.userStory.findUnique({ where: { id } });
    if (!story) return res.status(404).json({ error: "Không tìm thấy User Story" });

    // Chỉ PO/SM mới được quyền sửa tiêu đề, mô tả, ưu tiên, point. MEMBER chỉ được sửa status?
    // Wait, the requirement says "Là PO/SM, tôi muốn chỉnh sửa một User Story để cập nhật nội dung"
    // For now, let's enforce PO/SM for all modifications via this endpoint.
    const hasPermission = await checkPOorSM(req.user.userId, story.projectId);
    if (!hasPermission && (title || description || priority !== undefined || storyPoints !== undefined)) {
      return res.status(403).json({ error: "Thành viên thông thường không có quyền chỉnh sửa nội dung hoặc điểm của User Story." });
    }

    // Allow member to update status if they don't update protected fields.
    // Or just checkPOorSM generally. Let's just check PO or SM, except maybe status.
    // wait, member moving card on board modifies status. So if hasPermission is false, and ONLY status is present, allow it!
    if (!hasPermission) {
       const protectedFields = ["title", "description", "priority", "storyPoints", "assigneeId"];
       const updatingProtected = protectedFields.some(field => req.body[field] !== undefined);
       if(updatingProtected) {
          return res.status(403).json({ error: "Bạn không có quyền sửa đổi thông tin chính của User Story." });
       }
    }

    const updated = await prisma.userStory.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined,
        assigneeId: assigneeId !== undefined ? assigneeId : undefined,
        storyPoints: storyPoints !== undefined ? (parseInt(storyPoints) || null) : undefined,
      },
    });
    res.json({ message: "Cập nhật thành công", story: updated });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật User Story" });
  }
});

// GÁN USER STORY CHO MEMBER BẰNG EMAIL
app.patch("/api/userstory/:id/assign", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Không tìm thấy user với email này" });
    const updated = await prisma.userStory.update({
      where: { id: req.params.id },
      data: { assigneeId: user.id }
    });
    res.json({ message: "Gán thành viên thành công", story: updated });
  } catch (err) {
    res.status(500).json({ error: "Lỗi gán User Story" });
  }
});

// XEM CHI TIẾT USER STORY
app.get("/api/userstory/:id", async (req, res) => {
  try {
    const story = await prisma.userStory.findUnique({
      where: { id: req.params.id },
      include: { project: true, assignee: { select: { fullName: true, email: true } } },
    });
    if (!story) return res.status(404).json({ error: "Không tìm thấy User Story" });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// XEM DANH SÁCH USER STORIES TRONG PROJECT
app.get("/api/project/:projectId/userstories", async (req, res) => {
  const { projectId } = req.params;
  try {
    const stories = await prisma.userStory.findMany({
      where: { projectId },
      orderBy: { title: "asc" },
      include: { assignee: { select: { fullName: true, email: true } } }
    });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách User Stories" });
  }
});
// Lấy vai trò của người dùng hiện tại trong dự án
app.get("/api/project/:projectId/role", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.userId;
  try {
    const member = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (!member) return res.json({ role: "NONE" });
    res.json({ role: member.role });
  } catch (err) {
    res.status(500).json({ error: "Lỗi kiểm tra quyền" });
  }
});

// DASHBOARD STATS
app.get("/api/project/:projectId/dashboard", async (req, res) => {
  const { projectId } = req.params;
  try {
    const stories = await prisma.userStory.findMany({ where: { projectId } });
    const total = stories.length;
    const done = stories.filter(s => s.status === 'DONE').length;
    const inProgress = stories.filter(s => s.status === 'IN_PROGRESS').length;
    const todo = stories.filter(s => s.status === 'TODO').length;
    
    // Sum storyPoints properly
    const completedPoints = stories.filter(s => s.status === 'DONE').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
    
    res.json({
      totalStories: total,
      completedStories: done,
      inProgressStories: inProgress,
      todoStories: todo,
      completedPoints,
      totalPoints,
      progressPercentage
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy dữ liệu Dashboard" });
  }
});

// US-037: CHỈNH SỬA THÔNG TIN PROJECT (giữ nguyên từ code 1, có auth)
app.patch("/api/project/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, goal } = req.body;
  try {
    console.log("Đang xử lý update cho ID:", id);
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        goal: goal !== undefined ? goal : undefined,
      },
    });
    console.log("Update thành công!");
    res.json({ message: "Thành công", project: updatedProject });
  } catch (err) {
    console.error("Lỗi Prisma:", err.message);
    res.status(500).json({ error: "Lỗi kết nối Database hoặc ID không tồn tại" });
  }
});

// US-040: LẤY DANH SÁCH THÀNH VIÊN CỦA PROJECT (có auth)
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

// US-040: CẬP NHẬT ROLE CỦA THÀNH VIÊN (có kiểm tra PO)
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

// US-042: KICK THÀNH VIÊN KHỎI DỰ ÁN (Chỉ PO)
app.delete("/api/project/:projectId/members/:userId", authMiddleware, async (req, res) => {
  const { projectId, userId } = req.params;
  const requesterId = req.user.userId;

  try {
    const requester = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: requesterId, projectId } },
    });

    if (!requester || requester.role !== "PO") {
      return res.status(403).json({ error: "Chỉ Product Owner (PO) mới có quyền kick thành viên!" });
    }

    if (requesterId === userId) {
      return res.status(400).json({ error: "Bạn không thể tự kick chính mình khỏi dự án!" });
    }

    // Xóa record member
    await prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } },
    });

    // Unassign all user stories assigned to this user in this project
    await prisma.userStory.updateMany({
      where: { projectId, assigneeId: userId },
      data: { assigneeId: null }
    });

    res.json({ message: "Đã xóa thành viên khỏi dự án." });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi kick thành viên: " + err.message });
  }
});

// SEED: Thêm member đầu tiên (Mặc định là PENDING để đồng bộ)
app.post("/api/project/:projectId/members/seed", async (req, res) => {
  const { projectId } = req.params;
  const { userId, role = "MEMBER" } = req.body;
  try {
    const member = await prisma.projectMember.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: { status: "PENDING", role },
      create: { userId, projectId, role, status: "PENDING" },
    });
    res.json({ message: "Thêm thành công (trạng thái PENDING)", member });
  } catch (err) {
    res.status(400).json({ error: "Dữ liệu không hợp lệ: " + err.message });
  }
});

// Lắng nghe cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
  console.log(`✅ Server mạng tại http://0.0.0.0:${PORT}`);
});