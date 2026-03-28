import React, { useState, useEffect } from 'react';

export default function CreateStoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  initialData 
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    storyPoints: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  // Load dữ liệu khi mở modal (tạo mới hoặc chỉnh sửa)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'MEDIUM',
        storyPoints: initialData.storyPoints || '',
        tags: Array.isArray(initialData.tags) 
          ? initialData.tags 
          : (typeof initialData.tags === 'string' 
              ? JSON.parse(initialData.tags || '[]') 
              : [])
      });
    } else {
      setForm({ 
        title: '', 
        description: '', 
        priority: 'MEDIUM', 
        storyPoints: '',
        tags: [] 
      });
    }
    setTagInput('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      storyPoints: parseInt(form.storyPoints) || 0,
      tags: form.tags
    });
  };

  // Thêm tag
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || form.tags.includes(trimmed)) return;

    setForm(prev => ({
      ...prev,
      tags: [...prev.tags, trimmed]
    }));
    setTagInput('');
  };

  // Xóa tag
  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Nhấn Enter để thêm tag nhanh
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEdit ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
              <span className="material-symbols-outlined">{isEdit ? "edit_note" : "add_task"}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                {isEdit ? "Chỉnh sửa User Story" : "Tạo User Story mới"}
              </h3>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Tiêu đề */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">title</span>
              Tiêu đề Story <span className="text-error">*</span>
            </label>
            <input
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="VD: Thiết kế giao diện Dashboard"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">description</span>
              Mô tả chi tiết
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none min-h-[110px]"
              placeholder="Mô tả các tiêu chí chấp nhận (AC)..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Priority + Story Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">priority</span>
                Độ ưu tiên
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
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
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="0, 1, 2, 3, 5, 8, 13..."
                value={form.storyPoints}
                onChange={e => setForm({ ...form, storyPoints: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* ==================== PHẦN TAGS (US-014) ==================== */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">label</span>
              Nhãn / Tags
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Nhập tag (UI, Frontend, Bug...)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                disabled={loading}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                disabled={!tagInput.trim() || loading}
              >
                Thêm
              </button>
            </div>

            {/* Danh sách tag đã thêm - hiển thị đẹp hơn */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-2xl border border-primary/20"
                  >
                    <span className="font-medium">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary/70 hover:text-error transition-colors text-base leading-none"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl font-bold text-on-primary shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 ${
                isEdit ? "bg-tertiary" : "bg-primary"
              }`}
              disabled={loading || !form.title.trim()}
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