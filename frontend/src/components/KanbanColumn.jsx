// frontend/src/components/KanbanColumn.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableUserStoryCard } from './SortableUserStoryCard';

export default function KanbanColumn({
  title,
  status,
  stories = [],
  sprintId,
  onUpdateStory,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,        // ID rõ ràng hơn để dễ debug
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-surface-container-low rounded-2xl p-4 min-h-[500px] border border-outline-variant/30 flex flex-col transition-colors
        ${isOver ? 'ring-2 ring-primary/50 bg-surface-container' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="font-semibold text-on-surface">{title}</h4>
        <span className="text-xs bg-surface px-3 py-1 rounded-full text-on-surface-variant font-medium">
          {stories.length}
        </span>
      </div>

      {/* Vùng sortable */}
      <SortableContext
        items={stories.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 flex-1">
          {stories.map((story) => (
            <SortableUserStoryCard
              key={story.id}
              id={story.id}
              {...story}
              variant="sprint"
              userRole="MEMBER"
              onAssign={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onMove={onUpdateStory}           // Callback cập nhật status + sprint
            />
          ))}

          {stories.length === 0 && (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl text-on-surface-variant/50 text-sm italic">
              Chưa có task
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}