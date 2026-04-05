import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function TaskCard({ id, title, description, status, onDelete }) {
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
            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
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

      <div className="mt-2 flex justify-end">
        <div className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center">
           <span className="material-symbols-outlined text-[10px] text-outline">person</span>
        </div>
      </div>
    </div>
  );
}
