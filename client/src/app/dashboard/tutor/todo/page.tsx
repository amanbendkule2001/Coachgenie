"use client";

import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const initialTasks = [
  { id: 1, text: "Prepare lecture notes for Ch.8 – Thermodynamics",  done: false, priority: "High" },
  { id: 2, text: "Call Rajesh Kumar's parents about fee payment",      done: false, priority: "High" },
  { id: 3, text: "Upload Math formula sheet to Batch A portal",       done: true,  priority: "Medium" },
  { id: 4, text: "Create test paper for Physics Unit 3",              done: false, priority: "Medium" },
  { id: 5, text: "Reply to Arjun Patel's enquiry",                    done: false, priority: "Low" },
  { id: 6, text: "Update timetable for next week",                    done: true,  priority: "Low" },
];

const priorityColors: Record<string, string> = {
  High: "bg-danger-100 text-danger-600",
  Medium: "bg-warning-100 text-warning-600",
  Low: "bg-success-100 text-success-600",
};

export default function TodoPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  const toggle = (id: number) =>
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));

  const remove = (id: number) =>
    setTasks(t => t.filter(task => task.id !== id));

  const add = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: newTask.trim(), done: false, priority: "Medium" }]);
    setNewTask("");
  };

  const pending   = tasks.filter(t => !t.done).length;
  const completed = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CheckSquare size={22} className="text-primary-500" />
            Todo Tasks
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{pending} pending · {completed} completed</p>
        </div>
      </div>

      {/* Add task */}
      <div className="page-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder="Type a new task and press Enter..."
            className="input-field"
          />
          <button onClick={add} className="btn-primary flex-shrink-0">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Tasks list */}
      <div className="page-card space-y-2">
        <h2 className="text-base font-semibold text-text-primary mb-4">All Tasks</h2>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
              task.done ? "opacity-50" : "hover:bg-surface-muted"
            }`}
          >
            <button
              onClick={() => toggle(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                task.done
                  ? "bg-success-500 border-success-500"
                  : "border-surface-border hover:border-primary-400"
              }`}
            >
              {task.done && <span className="text-white text-xs font-bold">✓</span>}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through text-text-muted" : "text-text-primary"}`}>
              {task.text}
            </span>
            <span className={`badge flex-shrink-0 ${priorityColors[task.priority]}`}>{task.priority}</span>
            <button onClick={() => remove(task.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger-50 transition-colors flex-shrink-0">
              <Trash2 size={13} className="text-danger-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
