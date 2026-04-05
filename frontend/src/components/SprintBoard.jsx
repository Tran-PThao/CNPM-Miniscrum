// frontend/src/components/SprintBoard.jsx
import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function SprintBoard({ sprint, stories = [], onUpdateStory, userRole }) {
  const columns = {
    TODO: stories.filter(s => s.status === 'TODO'),
    IN_PROGRESS: stories.filter(s => s.status === 'IN_PROGRESS'),
    DONE: stories.filter(s => s.status === 'DONE'),
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        {sprint.name}
        <span className="text-sm font-normal text-on-surface-variant">
          ({stories.length} tasks)
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="To Do"
          status="TODO"
          stories={columns.TODO}
          sprintId={sprint.id}
          onUpdateStory={onUpdateStory}
        />
        <KanbanColumn
          title="In Progress"
          status="IN_PROGRESS"
          stories={columns.IN_PROGRESS}
          sprintId={sprint.id}
          onUpdateStory={onUpdateStory}
        />
        <KanbanColumn
          title="Done"
          status="DONE"
          stories={columns.DONE}
          sprintId={sprint.id}
          onUpdateStory={onUpdateStory}
        />
      </div>
    </div>
  );
}