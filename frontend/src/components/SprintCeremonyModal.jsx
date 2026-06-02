// frontend/src/components/SprintCeremonyModal.jsx
// US-023: Sprint Review  |  US-024: Sprint Retrospective
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SprintCeremonyModal({ isOpen, onClose, sprint, userRole }) {
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'retrospective'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  // Review fields (US-023)
  const [demoContent, setDemoContent] = useState('');
  const [feedback, setFeedback] = useState('');

  // Retrospective fields (US-024)
  const [wentWell, setWentWell] = useState('');
  const [needsImprovement, setNeedsImprovement] = useState('');
  const [actionItems, setActionItems] = useState('');

  // Metadata hiển thị
  const [reviewMeta, setReviewMeta] = useState(null);
  const [retroMeta, setRetroMeta] = useState(null);

  const isManagement = userRole === 'PO' || userRole === 'SM';

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load ceremony data khi mở modal
  useEffect(() => {
    if (!isOpen || !sprint) return;

    setLoading(true);
    api.get(`/sprints/${sprint.id}/ceremonies`)
      .then(res => {
        const { review, retrospective } = res.data;

        if (review) {
          setDemoContent(review.demoContent || '');
          setFeedback(review.feedback || '');
          setReviewMeta({ updatedAt: review.updatedAt, updatedBy: review.updatedBy });
        } else {
          setDemoContent('');
          setFeedback('');
          setReviewMeta(null);
        }

        if (retrospective) {
          setWentWell(retrospective.wentWell || '');
          setNeedsImprovement(retrospective.needsImprovement || '');
          setActionItems(retrospective.actionItems || '');
          setRetroMeta({ updatedAt: retrospective.updatedAt, updatedBy: retrospective.updatedBy });
        } else {
          setWentWell('');
          setNeedsImprovement('');
          setActionItems('');
          setRetroMeta(null);
        }
      })
      .catch(err => {
        console.error('Lỗi tải ceremony data:', err);
        // Nếu API ceremonies chưa có data, set rỗng
        setDemoContent(''); setFeedback('');
        setWentWell(''); setNeedsImprovement(''); setActionItems('');
      })
      .finally(() => setLoading(false));
  }, [isOpen, sprint]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // ==================== SAVE REVIEW (US-023) ====================
  const handleSaveReview = async () => {
    if (!demoContent.trim() && !feedback.trim()) {
      showToast('error', 'Vui lòng nhập ít nhất nội dung demo hoặc feedback.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/sprints/${sprint.id}/review`, {
        demoContent: demoContent.trim(),
        feedback: feedback.trim()
      });
      setReviewMeta({
        updatedAt: res.data.review?.updatedAt,
        updatedBy: res.data.review?.updatedBy
      });
      showToast('success', 'Lưu Sprint Review thành công!');
    } catch (err) {
      console.error('Lỗi lưu review:', err);
      showToast('error', err.response?.data?.error || 'Không thể lưu Sprint Review.');
    } finally {
      setSaving(false);
    }
  };

  // ==================== SAVE RETROSPECTIVE (US-024) ====================
  const handleSaveRetrospective = async () => {
    if (!wentWell.trim() && !needsImprovement.trim() && !actionItems.trim()) {
      showToast('error', 'Vui lòng nhập ít nhất một trường nội dung.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/sprints/${sprint.id}/retrospective`, {
        wentWell: wentWell.trim(),
        needsImprovement: needsImprovement.trim(),
        actionItems: actionItems.trim()
      });
      setRetroMeta({
        updatedAt: res.data.retrospective?.updatedAt,
        updatedBy: res.data.retrospective?.updatedBy
      });
      showToast('success', 'Lưu Sprint Retrospective thành công!');
    } catch (err) {
      console.error('Lỗi lưu retrospective:', err);
      showToast('error', err.response?.data?.error || 'Không thể lưu Sprint Retrospective.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !sprint) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-outline-variant/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

        {/* ===== HEADER ===== */}
        <div className="p-8 pb-0 border-b border-outline-variant/10 bg-surface-container-low">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">celebration</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-on-surface font-['Manrope'] tracking-tight">Sprint Ceremony</h2>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest opacity-60">{sprint.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* ===== TAB BAR ===== */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-sm font-bold transition-all ${
                activeTab === 'review'
                  ? 'bg-white text-primary border-t-2 border-x border-primary/30 border-outline-variant/10 -mb-[1px]'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              <span className="material-symbols-outlined text-lg">rate_review</span>
              Sprint Review
              {reviewMeta && <span className="w-2 h-2 bg-primary rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('retrospective')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-sm font-bold transition-all ${
                activeTab === 'retrospective'
                  ? 'bg-white text-primary border-t-2 border-x border-primary/30 border-outline-variant/10 -mb-[1px]'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              <span className="material-symbols-outlined text-lg">psychology</span>
              Retrospective
              {retroMeta && <span className="w-2 h-2 bg-primary rounded-full"></span>}
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ========== TAB: SPRINT REVIEW (US-023) ========== */}
              {activeTab === 'review' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs text-on-surface-variant">
                      Product Owner và Scrum Master ghi nhận kết quả demo và phản hồi từ stakeholders.
                    </p>
                  </div>

                  {/* Nội dung Demo */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">slideshow</span>
                      Nội dung Demo
                    </label>
                    <textarea
                      value={demoContent}
                      onChange={e => setDemoContent(e.target.value)}
                      placeholder="Mô tả các tính năng đã demo, kết quả từng User Story..."
                      rows={4}
                      disabled={!isManagement}
                      className="w-full px-5 py-4 bg-surface-container-low border-2 border-outline-variant/20 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">forum</span>
                      Phản hồi (Feedback)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Phản hồi từ stakeholders, ý kiến đóng góp, yêu cầu thay đổi..."
                      rows={4}
                      disabled={!isManagement}
                      className="w-full px-5 py-4 bg-surface-container-low border-2 border-outline-variant/20 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Metadata */}
                  {reviewMeta?.updatedAt && (
                    <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider text-right">
                      Cập nhật lần cuối: {new Date(reviewMeta.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  )}

                  {/* Save Button */}
                  {isManagement && (
                    <button
                      onClick={handleSaveReview}
                      disabled={saving}
                      className="w-full px-8 py-4 rounded-2xl font-black bg-primary text-on-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-sm"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">save</span>
                          Lưu Review
                        </>
                      )}
                    </button>
                  )}

                  {!isManagement && (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                      <span className="material-symbols-outlined text-base">lock</span>
                      Chỉ Product Owner (PO) hoặc Scrum Master (SM) mới có quyền chỉnh sửa Sprint Review.
                    </div>
                  )}
                </div>
              )}

              {/* ========== TAB: SPRINT RETROSPECTIVE (US-024) ========== */}
              {activeTab === 'retrospective' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs text-on-surface-variant">
                      Cả nhóm cùng nhìn lại Sprint: điều gì tốt, cần cải thiện, và hành động tiếp theo.
                    </p>
                  </div>

                  {/* Went Well */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                      <span className="material-symbols-outlined text-sm align-middle mr-1 text-emerald-600">thumb_up</span>
                      <span className="text-emerald-700">Went Well — Điều đã làm tốt</span>
                    </label>
                    <textarea
                      value={wentWell}
                      onChange={e => setWentWell(e.target.value)}
                      placeholder="Nhóm đã phối hợp tốt, hoàn thành đúng deadline, code review chất lượng..."
                      rows={3}
                      className="w-full px-5 py-4 bg-emerald-50/50 border-2 border-emerald-200/40 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    />
                  </div>

                  {/* Needs Improvement */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                      <span className="material-symbols-outlined text-sm align-middle mr-1 text-amber-600">construction</span>
                      <span className="text-amber-700">Needs Improvement — Cần cải thiện</span>
                    </label>
                    <textarea
                      value={needsImprovement}
                      onChange={e => setNeedsImprovement(e.target.value)}
                      placeholder="Giao tiếp chưa hiệu quả, thiếu kiểm thử, scope creep..."
                      rows={3}
                      className="w-full px-5 py-4 bg-amber-50/50 border-2 border-amber-200/40 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-amber-400/60 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                    />
                  </div>

                  {/* Action Items */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                      <span className="material-symbols-outlined text-sm align-middle mr-1 text-blue-600">task_alt</span>
                      <span className="text-blue-700">Action Items — Hành động cụ thể</span>
                    </label>
                    <textarea
                      value={actionItems}
                      onChange={e => setActionItems(e.target.value)}
                      placeholder="Tổ chức daily standup đúng giờ, thêm unit test cho module X, review PR trong 24h..."
                      rows={3}
                      className="w-full px-5 py-4 bg-blue-50/50 border-2 border-blue-200/40 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  {/* Metadata */}
                  {retroMeta?.updatedAt && (
                    <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider text-right">
                      Cập nhật lần cuối: {new Date(retroMeta.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={handleSaveRetrospective}
                    disabled={saving}
                    className="w-full px-8 py-4 rounded-2xl font-black bg-primary text-on-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-sm"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">save</span>
                        Lưu Retrospective
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all text-sm"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* ===== TOAST NOTIFICATION ===== */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-3 duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm font-bold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
