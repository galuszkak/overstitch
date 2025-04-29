import { writable } from 'svelte/store';

export interface DailyData {
  date: string; // YYYY-MM-DD format
  completedNutridrinks: number;
  waterConsumedMl: number; // New field for milliliters
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

// --- Constants ---
export const DEFAULT_WATER_SERVING_ML = 250; // Keep as a fallback/initial default
const SETTINGS_KEY_PREFIX = 'settings_';
const DEFAULT_WATER_SERVING_KEY = `${SETTINGS_KEY_PREFIX}defaultWaterServingMl`;

// Define a default serving size (can be moved to settings later)
const DEFAULT_DAILY_DATA: Omit<DailyData, 'date'> = {
  completedNutridrinks: 0,
  waterConsumedMl: 0, // New default
  pillTaken: false,
};

// Function to get today's data, initializing if it doesn't exist
export function getTodaysData(): DailyData {
  const todayStr = getTodayDateString();
  let todayData = getDataForDay(todayStr);

  if (!todayData) {
    todayData = {
      date: todayStr,
      completedNutridrinks: 0,
      waterConsumedMl: 0,
      pillTaken: false,
    };
    saveDataForDay(todayStr, todayData);
  }
  return todayData;
}

// Function to retrieve data for a specific day (e.g., for history)
export function getDataForDay(dateIsoString: string): DailyData | null {
    const key = `dailyData_${dateIsoString}`;
    const storedData = localStorage.getItem(key);
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData) as DailyData;
            // Ensure new field exists for older data from history
            if (parsedData.waterConsumedMl === undefined) {
              parsedData.waterConsumedMl = (parsedData as any).waterServings ? (parsedData as any).waterServings * DEFAULT_WATER_SERVING_ML : 0;
              // delete (parsedData as any).waterServings; // Optional: clean up
            }
            return parsedData;
        } catch (e) {
            console.error(`Error parsing data for ${dateIsoString}`, e);
            return null;
        }
    }
    return null; // No data found for this day
}

// Function to save data for a specific date
export function saveDataForDay(dateIsoString: string, data: DailyData) {
  const key = `dailyData_${dateIsoString}`;
  // Ensure the data object matches the latest interface
  const dataToSave: DailyData = {
      date: data.date,
      completedNutridrinks: data.completedNutridrinks,
      waterConsumedMl: data.waterConsumedMl ?? 0, // Ensure field exists
      pillTaken: data.pillTaken,
  };
  localStorage.setItem(key, JSON.stringify(dataToSave));
  console.log(`Data saved for ${dateIsoString}:`, dataToSave);
}

// --- Settings ---

export function getDefaultWaterServingMl(): number {
  const storedValue = localStorage.getItem(DEFAULT_WATER_SERVING_KEY);
  if (storedValue) {
    const parsedValue = parseInt(storedValue, 10);
    // Ensure it's a valid number and positive, otherwise use default
    if (!isNaN(parsedValue) && parsedValue > 0) {
      return parsedValue;
    }
  }
  return DEFAULT_WATER_SERVING_ML; // Return default if not set or invalid
}

export function saveDefaultWaterServingMl(ml: number): void {
  if (ml > 0 && ml % 50 === 0) { // Basic validation
    localStorage.setItem(DEFAULT_WATER_SERVING_KEY, ml.toString());
    console.log(`Saved default water serving size: ${ml}ml`);
  } else {
    console.error(`Invalid default water serving size: ${ml}. Must be positive and multiple of 50.`);
  }
}

// --- Nutridrink Timer State ---

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
