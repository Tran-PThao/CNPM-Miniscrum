// backend/src/routes/userstoryRoutes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Tạo mới User Story
router.post('/', async (req, res) => {
  try {
    const { title, description, storyPoints, priority, status = "BACKLOG", projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: "Thiếu title hoặc projectId" });
    }

    const userStory = await prisma.userStory.create({
      data: {
        title,
        description: description || null,
        storyPoints: storyPoints ? parseInt(storyPoints) : 0,
        priority: priority || "MEDIUM",
        status: status,                    // Quan trọng: nhận status từ frontend
        projectId,
      },
      include: {
        assignee: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    res.status(201).json(userStory);
  } catch (err) {
    console.error("Lỗi tạo UserStory:", err);
    res.status(500).json({ 
      error: "Không thể tạo User Story", 
      message: err.message 
    });
  }
});

// Lấy tất cả User Story theo Project (dùng cho Backlog page)
router.get('/project/:projectId/userstories', async (req, res) => {
  try {
    const { projectId } = req.params;
    const stories = await prisma.userStory.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật User Story (edit, change status, assign...)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, storyPoints, priority, status, assigneeId } = req.body;

    const updated = await prisma.userStory.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        storyPoints: storyPoints !== undefined ? parseInt(storyPoints) : undefined,
        priority: priority !== undefined ? priority : undefined,
        status: status !== undefined ? status : undefined,
        assigneeId: assigneeId !== undefined ? assigneeId : undefined,
      },
      include: {
        assignee: true
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa User Story
router.delete('/:id', async (req, res) => {
  try {
    await prisma.userStory.delete({ where: { id: req.params.id } });
    res.json({ message: "User Story đã được xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;