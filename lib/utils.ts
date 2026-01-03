import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(-4)}`;
}

export function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowStamp() {
  const d = new Date();
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function addMonths(dateISO: string, months: number) {
  const d = new Date(dateISO + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function maxDateISO(a?: string, b?: string) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

export function stageStatus(index: number, activeIndex: number) {
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "upcoming";
}
