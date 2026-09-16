import { useState, useRef } from "react";
import { Calendar, Folder, Plus } from "lucide-react";
import { useSelector } from "react-redux";

function KanbanCard({ task, onDragStart }) {
  const priorityColors = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };

  const avatarColors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-violet-600",
    "from-rose-500 to-rose-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
  ];

  const role = useSelector(state=>state.auth.user.role);

  const displayUser = role === "member" ? task.createdBy : task.assignedTo;

  const colorIdx = displayUser?.name
    ? displayUser.name.charCodeAt(0) % avatarColors.length
    : 0;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

 return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task._id); // Parent component automatically fromColumn calculate kar raha hai
      }}
      className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing select-none flex flex-col"
    >
      {/* 🚀 NEW: Project Name Label */}
      {task.project?.title && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2.5">
          <Folder className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{task.project?.title}</span>
        </div>
      )}

      <h4 className="font-semibold text-gray-900 mb-2 leading-snug">{task.title}</h4>
      
      {task.description && (
        <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Spacer pushes the bottom section down if description is short */}
      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          {task.priority && (
            <span className={`px-2 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
          
          {/* Tags (Reduced to 1 tag to save space for Date) */}
          {task.tags?.slice(0, 1).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-semibold">
              {tag}
            </span>
          ))}

          {/* 🚀 NEW: Deadline Indicator */}
          {task.deadline && (
            <div 
              title="Due Date"
              className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[11px] font-semibold border border-gray-100"
            >
              <Calendar className="w-3 h-3 text-gray-500" />
              <span>{formatDate(task.deadline)}</span>
            </div>
          )}
        </div>

        {/* 🚀 UPDATED: Team Member Avatar */}
        {displayUser?.name && (
          <div
            title={role === "member" ? `Assigned by: ${displayUser.name}` : `Assigned to: ${displayUser.name}`}
            className={`w-8 h-8 bg-linear-to-br ${avatarColors[colorIdx]} rounded-full flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white`}
          >
            <span className="text-white text-xs font-bold tracking-wide">
              {displayUser.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, color, bgColor, tasks, isOver, onDragOver, onDrop, onDragStart, onAddTask }) {
  return (
    <div className="flex-1 min-w-72 flex flex-col">
      <div
        className={`rounded-xl flex-1 p-4 transition-colors ${isOver ? "bg-blue-50 ring-2 ring-blue-300" : "bg-gray-50"}`}
        onDragOver={(e) => { e.preventDefault(); onDragOver(id); }}
        onDrop={(e) => { e.preventDefault(); onDrop(id); }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <span className={`px-2 py-0.5 ${bgColor} text-gray-600 rounded-md text-xs font-semibold`}>
              {tasks?.length}
            </span>
          </div>
          {onAddTask && (
            <button
              onClick={() => onAddTask(id)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-3 min-h-16">
          {(tasks || []).map((task) => (
            <KanbanCard key={task?._id || task?.id} task={task} onDragStart={onDragStart} />
          ))}
          {(!tasks || tasks.length === 0) && (
            <div 
              className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all mt-3 ${
                isOver 
                  ? "border-blue-400 bg-blue-100/50 scale-[1.02]" 
                  : "border-gray-300 bg-transparent"
              }`}
            >
              <p className={`text-sm font-medium ${isOver ? "text-blue-600" : "text-gray-500"}`}>
                {isOver ? "Drop task here" : "No tasks yet"}
              </p>
              {!isOver && (
                <p className="text-xs text-gray-400 mt-1">Drag and drop a task</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export function KanbanBoard({ todoTasks, inProgressTasks, doneTasks, onTaskMove, onAddTask }) {
  const [overColumn, setOverColumn] = useState(null);
  const dragging = useRef(null);

  const handleDragStart = (taskId, _fromColumn) => {
    // Determine actual column from task id
    const fromCol =
      todoTasks.find((t) => t._id === taskId) ? "todo" :
      inProgressTasks.find((t) => t._id === taskId) ? "inProgress" : "done";
    dragging.current = { taskId, fromColumn: fromCol };
  };

  const handleDrop = (toColumn) => {
    if (dragging.current && dragging.current.fromColumn !== toColumn) {
      onTaskMove?.(dragging.current.taskId, toColumn);
    }
    setOverColumn(null);
    dragging.current = null;
  };

  return (
    <div
      className="flex gap-6 overflow-x-auto pb-4"
      onDragEnd={() => { setOverColumn(null); dragging.current = null; }}
    >
      <KanbanColumn
        id="todo"
        title="To Do"
        color="bg-gray-400"
        bgColor="bg-gray-200"
        tasks={todoTasks}
        isOver={overColumn === "todo"}
        onDragOver={setOverColumn}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onAddTask={onAddTask}
      />
      <KanbanColumn
        id="inProgress"
        title="In Progress"
        color="bg-blue-500"
        bgColor="bg-blue-100"
        tasks={inProgressTasks}
        isOver={overColumn === "inProgress"}
        onDragOver={setOverColumn}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onAddTask={onAddTask}
      />
      <KanbanColumn
        id="done"
        title="Done"
        color="bg-emerald-500"
        bgColor="bg-emerald-100"
        tasks={doneTasks}
        isOver={overColumn === "done"}
        onDragOver={setOverColumn}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onAddTask={onAddTask}
      />
    </div>
  );
}
