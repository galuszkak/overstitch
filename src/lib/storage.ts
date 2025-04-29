import { writable } from 'svelte/store';

export interface DailyData {
  date: string; // YYYY-MM-DD
  completedNutridrinks: number;
  waterServings: number;
  pillTaken: boolean;
}

// Function to get today's date string in YYYY-MM-DD format
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get data for a specific date
export function getDataForDay(date: string): DailyData | null {
  const storedData = localStorage.getItem(`day-${date}`);
  if (storedData) {
    try {
      return JSON.parse(storedData) as DailyData;
    } catch (e) {
      console.error("Error parsing stored data for date:", date, e);
      localStorage.removeItem(`day-${date}`); // Remove corrupted data
      return null;
    }
  } 
  return null;
}

// Function to save data for a specific date
export function saveDataForDay(date: string, data: DailyData): void {
  try {
    localStorage.setItem(`day-${date}`, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data for date:", date, e);
    // Handle potential storage quota errors if necessary
  }
}

// Function to get today's data, initializing if it doesn't exist
export function getTodaysData(): DailyData {
  const todayStr = getTodayDateString();
  let todayData = getDataForDay(todayStr);

  if (!todayData) {
    todayData = {
      date: todayStr,
      completedNutridrinks: 0,
      waterServings: 0,
      pillTaken: false,
    };
    saveDataForDay(todayStr, todayData);
  }
  return todayData;
}

// --- Nutridrink Timer State Persistence ---

interface TimerState {
  startTime: number;
  pausedTime?: number; // Optional: To handle pausing if app goes background without service worker
}

const NUTRIDRINK_TIMER_KEY = 'nutridrinkTimer';

export function saveNutridrinkTimerState(startTime: number): void {
  const state: TimerState = { startTime };
  localStorage.setItem(NUTRIDRINK_TIMER_KEY, JSON.stringify(state));
}

export function getNutridrinkTimerState(): TimerState | null {
  const storedState = localStorage.getItem(NUTRIDRINK_TIMER_KEY);
  if (storedState) {
    try {
      return JSON.parse(storedState) as TimerState;
    } catch (e) {
      console.error("Error parsing timer state:", e);
      localStorage.removeItem(NUTRIDRINK_TIMER_KEY);
      return null;
    }
  }
  return null;
}

export function clearNutridrinkTimerState(): void {
  localStorage.removeItem(NUTRIDRINK_TIMER_KEY);
}

// --- Svelte Store for reactive updates ---
// We'll manage the daily data within the App component for now,
// but a store could be useful if state needs sharing across components.
// export const dailyDataStore = writable<DailyData>(getTodaysData());
