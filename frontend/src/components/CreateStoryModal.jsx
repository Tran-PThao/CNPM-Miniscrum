import React, { useState, useEffect } from 'react';

export default function CreateStoryModal({ isOpen, onClose, onSubmit, loading, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    storyPoints: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'MEDIUM',
        storyPoints: initialData.storyPoints || ''
      });
    } else {
      setForm({ title: '', description: '', priority: 'MEDIUM', storyPoints: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      storyPoints: parseInt(form.storyPoints) || 0
    });
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEdit ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
              <span className="material-symbols-outlined">{isEdit ? "edit_note" : "add_task"}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">{isEdit ? "Chỉnh sửa User Story" : "Tạo User Story mới"}</h3>
              <p className="text-xs text-on-surface-variant font-medium">
                {isEdit ? `Đang cập nhật mã ${initialData.id?.slice(-6)}` : "Thêm yêu cầu mới vào Product Backlog"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">title</span>
              Tiêu đề Story <span className="text-error">*</span>
            </label>
            <input
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
              placeholder="VD: Thiết kế giao diện Dashboard"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">description</span>
              Mô tả chi tiết
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[100px] placeholder:text-outline"
              placeholder="Mô tả các tiêu chí chấp nhận (AC)..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">priority</span>
                Độ ưu tiên
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                disabled={loading}
              >
                <option value="HIGH">HIGH (CAO)</option>
                <option value="MEDIUM">MEDIUM (TRUNG BÌNH)</option>
                <option value="LOW">LOW (THẤP)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">rebase_edit</span>
                Story Points
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="0, 1, 2, 3, 5, 8, 13..."
                value={form.storyPoints}
                onChange={e => setForm({ ...form, storyPoints: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-8 py-2.5 rounded-xl font-bold text-on-primary shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 text-sm ${isEdit ? "bg-tertiary shadow-tertiary/25 hover:scale-[0.98]" : "bg-primary shadow-primary/25 hover:scale-[0.98]"}`}
              disabled={loading}
            >
              {loading && <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
              {loading ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Tạo User Story')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
