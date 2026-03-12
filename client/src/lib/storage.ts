/**
 * storage.ts
 * ──────────
 * Centralized localStorage utilities for SmartEdu Tutor Dashboard.
 * All modules use these helpers to ensure consistent read/write patterns.
 *
 * Usage:
 *   import { loadFromStorage, saveToStorage } from "@/lib/storage";
 *   const students = loadFromStorage<Student[]>("students", []);
 *   saveToStorage("students", students);
 */

/** Read a value from localStorage, returning fallback if missing or invalid. */
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[storage] Failed to parse key "${key}"`);
    return fallback;
  }
}

/** Serialize and write a value to localStorage. */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error(`[storage] Failed to save key "${key}"`);
  }
}

/** Remove a key from localStorage. */
export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

/** Generate a simple unique ID (timestamp + random). */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
