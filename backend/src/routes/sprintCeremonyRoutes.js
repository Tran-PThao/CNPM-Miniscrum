// backend/src/routes/sprintCeremonyRoutes.js
// US-023: Sprint Review  |  US-024: Sprint Retrospective
// Lưu dữ liệu ceremony vào trường goal của Sprint dưới dạng JSON container
// Không thay đổi schema Prisma, không migrate

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Parse trường goal từ DB thành object.
 * - null / empty  → { text: null }
 * - plain string  → { text: "..." }
 * - JSON string   → parsed object
 */
function parseGoalField(goalRaw) {
  if (!goalRaw) return { text: null };

  try {
    const parsed = JSON.parse(goalRaw);
    // Nếu parse được nhưng không phải object (ví dụ: số, boolean) → coi như text
    if (typeof parsed !== 'object' || parsed === null) {
      return { text: goalRaw };
    }
    return parsed;
  } catch {
    // Không phải JSON hợp lệ → đây là plain text goal ban đầu
    return { text: goalRaw };
  }
}

/**
 * Serialize goal object thành JSON string để lưu vào DB
 */
function serializeGoalField(goalObj) {
  return JSON.stringify(goalObj);
}

/**
 * Kiểm tra user có phải PO hoặc SM trong project không
 */
async function checkPOorSM(userId, projectId) {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return member && (member.role === 'PO' || member.role === 'SM');
}

/**
 * Kiểm tra user có phải thành viên (ACCEPTED) trong project không
 */
async function checkMember(userId, projectId) {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return member && member.status === 'ACCEPTED';
}

// ============================================================
// US-023: SPRINT REVIEW
// ============================================================

/**
 * PUT /:sprintId/review
 * Lưu hoặc cập nhật nội dung Sprint Review
 * Quyền: PO hoặc SM
 * Body: { demoContent: string, feedback: string }
 */
router.put('/:sprintId/review', async (req, res) => {
  const { sprintId } = req.params;
  const { demoContent, feedback } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Tìm Sprint
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ error: 'Không tìm thấy Sprint' });
    }

    // 2. Kiểm tra quyền PO hoặc SM
    const hasPermission = await checkPOorSM(userId, sprint.projectId);
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Chỉ Product Owner (PO) hoặc Scrum Master (SM) mới có quyền ghi Sprint Review!'
      });
    }

    // 3. Validate input
    if (!demoContent && !feedback) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp ít nhất nội dung demo (demoContent) hoặc phản hồi (feedback).'
      });
    }

    // 4. Parse goal hiện tại → merge review data → ghi lại
    const goalObj = parseGoalField(sprint.goal);
    goalObj.review = {
      demoContent: demoContent || '',
      feedback: feedback || '',
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    };

    const updated = await prisma.sprint.update({
      where: { id: sprintId },
      data: { goal: serializeGoalField(goalObj) }
    });

    res.json({
      message: 'Lưu Sprint Review thành công!',
      review: goalObj.review,
      sprintId: updated.id
    });
  } catch (err) {
    console.error('Lỗi lưu Sprint Review:', err);
    res.status(500).json({ error: 'Lỗi server khi lưu Sprint Review: ' + err.message });
  }
});

/**
 * GET /:sprintId/review
 * Lấy nội dung Sprint Review
 * Quyền: Thành viên dự án (ACCEPTED)
 */
router.get('/:sprintId/review', async (req, res) => {
  const { sprintId } = req.params;
  const userId = req.user.userId;

  try {
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ error: 'Không tìm thấy Sprint' });
    }

    // Kiểm tra quyền: phải là thành viên dự án
    const isMember = await checkMember(userId, sprint.projectId);
    if (!isMember) {
      return res.status(403).json({ error: 'Bạn không phải thành viên của dự án này.' });
    }

    const goalObj = parseGoalField(sprint.goal);

    res.json({
      sprintId: sprint.id,
      sprintName: sprint.name,
      review: goalObj.review || null
    });
  } catch (err) {
    console.error('Lỗi lấy Sprint Review:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy Sprint Review' });
  }
});

// ============================================================
// US-024: SPRINT RETROSPECTIVE
// ============================================================

/**
 * PUT /:sprintId/retrospective
 * Lưu hoặc cập nhật nội dung Sprint Retrospective
 * Quyền: Thành viên dự án (ACCEPTED) — cả nhóm đều tham gia retro
 * Body: { wentWell: string, needsImprovement: string, actionItems: string }
 */
router.put('/:sprintId/retrospective', async (req, res) => {
  const { sprintId } = req.params;
  const { wentWell, needsImprovement, actionItems } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Tìm Sprint
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ error: 'Không tìm thấy Sprint' });
    }

    // 2. Kiểm tra quyền — retro cho mọi thành viên
    const isMember = await checkMember(userId, sprint.projectId);
    if (!isMember) {
      return res.status(403).json({ error: 'Bạn không phải thành viên của dự án này.' });
    }

    // 3. Validate input
    if (!wentWell && !needsImprovement && !actionItems) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp ít nhất một trong các trường: wentWell, needsImprovement, actionItems.'
      });
    }

    // 4. Parse goal hiện tại → merge retrospective data → ghi lại
    const goalObj = parseGoalField(sprint.goal);
    goalObj.retrospective = {
      wentWell: wentWell || '',
      needsImprovement: needsImprovement || '',
      actionItems: actionItems || '',
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    };

    const updated = await prisma.sprint.update({
      where: { id: sprintId },
      data: { goal: serializeGoalField(goalObj) }
    });

    res.json({
      message: 'Lưu Sprint Retrospective thành công!',
      retrospective: goalObj.retrospective,
      sprintId: updated.id
    });
  } catch (err) {
    console.error('Lỗi lưu Sprint Retrospective:', err);
    res.status(500).json({ error: 'Lỗi server khi lưu Sprint Retrospective: ' + err.message });
  }
});

/**
 * GET /:sprintId/retrospective
 * Lấy nội dung Sprint Retrospective
 * Quyền: Thành viên dự án (ACCEPTED)
 */
router.get('/:sprintId/retrospective', async (req, res) => {
  const { sprintId } = req.params;
  const userId = req.user.userId;

  try {
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ error: 'Không tìm thấy Sprint' });
    }

    // Kiểm tra quyền
    const isMember = await checkMember(userId, sprint.projectId);
    if (!isMember) {
      return res.status(403).json({ error: 'Bạn không phải thành viên của dự án này.' });
    }

    const goalObj = parseGoalField(sprint.goal);

    res.json({
      sprintId: sprint.id,
      sprintName: sprint.name,
      retrospective: goalObj.retrospective || null
    });
  } catch (err) {
    console.error('Lỗi lấy Sprint Retrospective:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy Sprint Retrospective' });
  }
});

// ============================================================
// TIỆN ÍCH: Lấy tất cả ceremony data của Sprint (Review + Retro)
// ============================================================

/**
 * GET /:sprintId/ceremonies
 * Lấy toàn bộ dữ liệu ceremony (review + retrospective + goal gốc)
 * Quyền: Thành viên dự án (ACCEPTED)
 */
router.get('/:sprintId/ceremonies', async (req, res) => {
  const { sprintId } = req.params;
  const userId = req.user.userId;

  try {
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ error: 'Không tìm thấy Sprint' });
    }

    const isMember = await checkMember(userId, sprint.projectId);
    if (!isMember) {
      return res.status(403).json({ error: 'Bạn không phải thành viên của dự án này.' });
    }

    const goalObj = parseGoalField(sprint.goal);

    res.json({
      sprintId: sprint.id,
      sprintName: sprint.name,
      sprintStatus: sprint.status,
      goal: goalObj.text || null,
      review: goalObj.review || null,
      retrospective: goalObj.retrospective || null
    });
  } catch (err) {
    console.error('Lỗi lấy ceremonies:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy dữ liệu ceremony' });
  }
});

module.exports = router;
