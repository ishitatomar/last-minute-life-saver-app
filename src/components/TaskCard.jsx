import { toggleTask } from "../services/taskService";

export default function TaskCard({ task, onDelete, refresh }) {
  async function handleComplete() {
    await toggleTask(task.id, !task.completed);
    await refresh();
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">

      {/* Title */}
      <h2
        className={`text-xl sm:text-2xl font-bold break-words ${
          task.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {task.title}
      </h2>

      {/* Description */}
      <p className="text-gray-400 mt-2 break-words">
        {task.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mt-4">

        <span className="bg-cyan-600 px-4 py-2 rounded-full text-sm">
          {task.category}
        </span>

        <span className="bg-red-600 px-4 py-2 rounded-full text-sm">
          {task.priority}
        </span>

        <span className="bg-green-600 px-4 py-2 rounded-full text-sm">
          {task.dueDate}
        </span>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">

        <button
          onClick={handleComplete}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-semibold transition ${
            task.completed
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}