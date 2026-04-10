import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function TaskCard({ id, title, description, status, assignee, assigneeId, members = [], onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cleanId = id.replace('task-', '');

  const handleAssigneeChange = (e) => {
    const newAssigneeId = e.target.value === 'unassigned' ? null : e.target.value;
    onUpdate({ assigneeId: newAssigneeId });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group
        ${isDragging ? 'z-50 ring-2 ring-primary/30' : ''}`}
    >
      <div className="flex justify-between items-start gap-2 mb-1">
        <h5 className="text-xs font-bold text-on-surface line-clamp-2 leading-tight">
          {title}
        </h5>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(cleanId); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 text-error rounded transition-opacity"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        )}
      </div>
      
      {description && (
        <p className="text-[10px] text-on-surface-variant/70 line-clamp-2 leading-normal">
          {description}
        </p>
      )}

      <div className="mt-2 flex justify-end items-center gap-2">
        <div 
          className="relative group/assignee"
          onClick={(e) => e.stopPropagation()}
        >
          {assignee ? (
            <div 
              className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shadow-sm"
              title={assignee.fullName || assignee.email}
            >
              { (assignee.fullName || assignee.email || '?').charAt(0).toUpperCase() }
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-outline border border-dashed border-outline-variant/30">
               <span className="material-symbols-outlined text-[12px]">person_add</span>
            </div>
          )}

          {/* Hidden select that appears on hover or just a stylized select */}
          <select
            value={assigneeId || 'unassigned'}
            onChange={handleAssigneeChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Đổi người phụ trách"
          >
            <option value="unassigned">Chưa gán</option>
            {members.map(m => (
              <option key={m.user.id} value={m.user.id}>
                {m.user.fullName || m.user.email}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
