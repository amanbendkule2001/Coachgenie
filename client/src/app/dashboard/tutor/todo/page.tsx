"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, CheckSquare, Trash2, Calendar, AlertCircle, Sparkles } from "lucide-react";
import { loadFromStorage, saveToStorage, generateId } from "@/lib/storage";
import { Todo } from "@/types";
import clsx from "clsx";

const SEED: Todo[] = [
  { id:"td1", task:"Prepare question paper for JEE Mock Test", priority:"High", completed:false, createdAt:"2026-03-10" },
  { id:"td2", task:"Review pending fee payments for Batch B",  priority:"Medium",completed:false, createdAt:"2026-03-11" },
  { id:"td3", task:"Upload Thermodynamics lecture notes",      priority:"Low",   completed:false, createdAt:"2026-03-11" },
  { id:"td4", task:"Call parents of at-risk students",         priority:"High",  completed:true,  createdAt:"2026-03-09" },
  { id:"td5", task:"Schedule doubt clearing session",          priority:"Medium",completed:true,  createdAt:"2026-03-08" },
];

const PRIORITIES: Todo["priority"][] = ["Low", "Medium", "High"];

const PRIORITY_COLORS: Record<Todo["priority"], { text: string; bg: string; badge: string; icon: React.ReactNode }> = {
  High:   { text:"text-danger-400",  bg:"bg-danger-500/20",   badge:"bg-danger-500/20 text-danger-400 border-danger-500/30",     icon:<AlertCircle size={14}/> },
  Medium: { text:"text-warning-500", bg:"bg-warning-500/20",  badge:"bg-warning-500/20 text-warning-500 border-warning-500/30",  icon:<AlertCircle size={14}/> },
  Low:    { text:"text-primary-400", bg:"bg-primary-500/20",  badge:"bg-primary-500/20 text-primary-400 border-primary-500/30",  icon:<Sparkles size={14}/> },
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Todo["priority"]>("Medium");
  const [filter, setFilter] = useState<"All"|"Active"|"Completed">("All");

  useEffect(() => {
    const stored = loadFromStorage<Todo[]>("todos", []);
    setTodos(stored.length ? stored : SEED);
    if (!stored.length) saveToStorage("todos", SEED);
  }, []);

  const persist = (data: Todo[]) => { setTodos(data); saveToStorage("todos", data); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const todo: Todo = { id: generateId(), task: newTask.trim(), priority: newPriority, completed: false, createdAt: new Date().toISOString().split("T")[0] };
    persist([todo, ...todos]);
    setNewTask("");
    setNewPriority("Medium");
  };

  const toggle = (id: string) => persist(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: string) => persist(todos.filter(t => t.id !== id));
  const clearCompleted = () => persist(todos.filter(t => !t.completed));

  const filtered = useMemo(() => {
    if (filter === "All") return todos;
    return todos.filter(t => filter === "Completed" ? t.completed : !t.completed);
  }, [todos, filter]);

  const stats = {
    total: todos.length,
    completed: todos.filter(t=>t.completed).length,
    active: todos.filter(t=>!t.completed).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CheckSquare size={20} className="text-primary-500"/> Tasks
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{stats.active} tasks remaining</p>
        </div>
      </div>

      {/* Input area */}
      <div className="page-card !p-4">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            value={newTask} onChange={e=>setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 input-field"
          />
          <div className="flex gap-3">
            <select value={newPriority} onChange={e=>setNewPriority(e.target.value as Todo["priority"])} className="input-field w-32 shrink-0">
              {PRIORITIES.map(p=><option key={p} value={p}>{p} Priority</option>)}
            </select>
            <button type="submit" disabled={!newTask.trim()} className="btn-primary shrink-0 disabled:opacity-50">
              <Plus size={16}/> Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Filters and List */}
      <div className="page-card !p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-muted/30">
          <div className="flex gap-2">
            {(["All","Active","Completed"] as const).map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className={clsx("px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  filter===f ? "bg-[var(--surface-card)] shadow-sm text-text-primary border border-surface-border" : "text-text-muted hover:bg-surface-muted")}>
                {f} {f==="All"?stats.total : f==="Active"?stats.active : stats.completed}
              </button>
            ))}
          </div>
          {stats.completed > 0 && (
            <button onClick={clearCompleted} className="text-xs font-medium text-text-muted hover:text-danger-500 transition-colors">
              Clear completed
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-surface-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <CheckSquare size={40} className="text-surface-border"/>
              <p className="text-sm text-text-muted font-medium">No tasks found. Relax or add a new one!</p>
            </div>
          ) : (
            filtered.map(t => (
              <div key={t.id} className={clsx("group flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors",
                t.completed ? "bg-surface-muted/50" : "hover:bg-surface-muted/30")}>

                {/* Left: Checkbox + Text */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <button onClick={() => toggle(t.id)}
                    className={clsx("w-5 h-5 rounded flex shrink-0 items-center justify-center border transition-all mt-0.5",
                      t.completed ? "bg-primary-500 border-primary-500 text-white" : "border-surface-border text-transparent hover:border-primary-400 hover:bg-primary-50")}>
                    <CheckSquare size={12}/>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={clsx("text-sm font-medium transition-all break-words", t.completed ? "text-text-muted line-through" : "text-text-primary")}>
                      {t.task}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 opacity-80">
                      <span className={clsx("badge border flex items-center gap-1 !px-1.5 !py-0", PRIORITY_COLORS[t.priority].badge)}>
                        {PRIORITY_COLORS[t.priority].icon}{t.priority}
                      </span>
                      <span className="text-[11px] text-text-muted flex items-center gap-1"><Calendar size={10}/> {t.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Delete */}
                <button onClick={() => remove(t.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 p-2 rounded-xl text-text-muted hover:text-danger-500 hover:bg-danger-50 transition-all self-end sm:self-auto shrink-0 mt-2 sm:mt-0">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
