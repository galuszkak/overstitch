<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    getTodaysData,
    saveDataForDay,
    saveNutridrinkTimerState,
    getNutridrinkTimerState,
    clearNutridrinkTimerState,
    type DailyData
  } from './lib/storage';

  // State variables
  let completedNutridrinksToday: number = 0;
  let waterServingsToday: number = 0;
  let pillTakenToday: boolean = false;

  let nutridrinkInProgress: boolean = false;
  let nutridrinkStartTime: number | null = null;
  let nutridrinkTimerInterval: number | null = null;
  let nutridrinkTimeRemaining: number = 0; // in seconds
  let reminderFlags = { min10: false, min20: false, min30: false }; // Define reminderFlags

  const NUTRIDRINK_DURATION = 30 * 60; // 30 minutes in seconds
  const currentDayString = new Date().toDateString();
  const todayIsoString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // --- Data Loading & Saving ---
  function loadDataForToday() {
    console.log("Loading data for today...");
    const data = getTodaysData(); // Gets or initializes data for today
    completedNutridrinksToday = data.completedNutridrinks;
    waterServingsToday = data.waterServings;
    pillTakenToday = data.pillTaken;
  }

  function saveData() {
    console.log("Saving data...");
    const data: DailyData = {
      date: todayIsoString, // Added date property
      completedNutridrinks: completedNutridrinksToday,
      waterServings: waterServingsToday,
      pillTaken: pillTakenToday,
    };
    saveDataForDay(todayIsoString, data);
  }

  function stopTimer(completed: boolean) {
    if (nutridrinkTimerInterval) {
      clearInterval(nutridrinkTimerInterval);
      nutridrinkTimerInterval = null;
    }
    nutridrinkInProgress = false;
    nutridrinkStartTime = null;
    nutridrinkTimeRemaining = 0;
    reminderFlags = { min10: false, min20: false, min30: false };
    clearNutridrinkTimerState();
    if (completed) {
        completedNutridrinksToday++;
    }
    saveData(); // Save state after stopping/completing
  }

  function updateTimer() {
    if (!nutridrinkStartTime) return;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - nutridrinkStartTime) / 1000);
    nutridrinkTimeRemaining = Math.max(0, NUTRIDRINK_DURATION - elapsedSeconds);

    // Update reminder flags
    const elapsedMinutes = elapsedSeconds / 60;
    reminderFlags.min10 = elapsedMinutes >= 10;
    reminderFlags.min20 = elapsedMinutes >= 20;
    reminderFlags.min30 = elapsedMinutes >= 30; // Or when time is up

    if (nutridrinkTimeRemaining <= 0) {
      console.log("Nutridrink finished!");
      stopTimer(true); // Mark as completed
    } else {
        // Trigger reactive update
        nutridrinkTimeRemaining = nutridrinkTimeRemaining;
        reminderFlags = reminderFlags;
    }
  }

  onMount(() => {

    loadDataForToday();

    // Check if a nutridrink timer was running previously
    const savedTimerState = getNutridrinkTimerState();
    if (savedTimerState && savedTimerState.startTime) {
      const now = Date.now();
      const savedStartTime = savedTimerState.startTime;
      const elapsedSinceStart = Math.floor((now - savedStartTime) / 1000);
      const currentRemaining = NUTRIDRINK_DURATION - elapsedSinceStart;

      if (currentRemaining > 0) {
        console.log("Restoring Nutridrink timer...");
        nutridrinkInProgress = true;
        nutridrinkStartTime = savedStartTime; // Restore the original start time
        nutridrinkTimeRemaining = currentRemaining;
        updateTimer(); // Initial update based on restored state
        nutridrinkTimerInterval = setInterval(updateTimer, 1000);
      } else {
        console.log("Saved timer expired while app was closed.");
        // Timer finished while away. Should we count it?
        // Option 1: Assume completed if it finished while closed.
        // completedNutridrinksToday++; // Increment if policy dictates
        // saveData(); // Save the incremented count
        // Option 2: Just clear the state (current behavior)
        clearNutridrinkTimerState();
      }
    } else {
        // Clear any potentially invalid state if startTime is missing
        clearNutridrinkTimerState();
    }
  });

  onDestroy(() => {
    if (nutridrinkTimerInterval) {
      clearInterval(nutridrinkTimerInterval);
    }
    // Timer state is saved on start, and cleared on stop/completion.
    // No need to save again on destroy unless pausing is implemented.
  });


  // --- Action Handlers ---
  function startNutridrink() {
    if (nutridrinkInProgress) return; // Removed browser check
    console.log("Starting Nutridrink...");
    nutridrinkInProgress = true;
    nutridrinkStartTime = Date.now();
    nutridrinkTimeRemaining = NUTRIDRINK_DURATION;
    reminderFlags = { min10: false, min20: false, min30: false }; // Reset flags

    // Save only the start time as per storage.ts
    saveNutridrinkTimerState(nutridrinkStartTime);

    updateTimer(); // Initial update
    nutridrinkTimerInterval = setInterval(updateTimer, 1000);
  }

  function addWater() {
    console.log("Adding water...");
    waterServingsToday++;
    saveData();
  }

  function takePill() {
    if (pillTakenToday) return;
    console.log("Taking pill...");
    pillTakenToday = true;
    saveData();
  }

  // --- Utility ---
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

</script>

<!-- Add data-theme attribute to apply DaisyUI theme -->
<main class="container mx-auto p-4 font-sans min-h-screen" data-theme="light">

  <h1 class="text-3xl font-bold mb-8 text-center text-primary">Daily Tracker</h1>

  <!-- Today's Stats using DaisyUI Stats component -->
  <section class="stats shadow w-full mb-8 bg-base-100">
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block size-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> <!-- Placeholder icon -->
      </div>
      <div class="stat-title">Nutridrinks</div>
      <div class="stat-value text-orange-500">{completedNutridrinksToday}</div>
      <div class="stat-desc">{currentDayString}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block size-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg> <!-- Placeholder icon -->
      </div>
      <div class="stat-title">Water Servings</div>
      <div class="stat-value text-blue-500">{waterServingsToday}</div>
       <div class="stat-desc">Target: 8+</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block size-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <!-- Placeholder icon -->
      </div>
      <div class="stat-title">Pill Taken</div>
      <div class="stat-value {pillTakenToday ? 'text-success' : 'text-error'}">
        {pillTakenToday ? 'Yes' : 'No'}
      </div>
       <div class="stat-desc">{pillTakenToday ? '✔️ Good job!' : '❌ Remember!'}</div>
    </div>
  </section>

  <!-- Nutridrink Progress using DaisyUI Alert -->
  {#if nutridrinkInProgress}
    <section class="alert alert-warning shadow-lg mb-8">
       <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <div>
        <h3 class="font-bold">Nutridrink In Progress!</h3>
        <div class="text-xs">Time Remaining:</div>
         <div class="text-xl font-mono tabular-nums">
            {formatTime(nutridrinkTimeRemaining)}
         </div>
         <!-- Reminder indicators -->
         <div class="flex justify-around mt-1 text-xs">
             <span class={reminderFlags.min10 ? 'text-success font-semibold' : 'opacity-50'}>10 min</span>
             <span class={reminderFlags.min20 ? 'text-success font-semibold' : 'opacity-50'}>20 min</span>
             <span class={reminderFlags.min30 ? 'text-success font-semibold' : 'opacity-50'}>30 min</span>
         </div>
      </div>
       <!-- Optional: Add a button to cancel the timer -->
       <button class="btn btn-sm btn-ghost" on:click={() => stopTimer(false)}>Cancel</button>
    </section>
  {/if}

  <!-- Action Buttons using DaisyUI Buttons -->
  <section class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
    <button
      on:click={startNutridrink}
      disabled={nutridrinkInProgress}
      class="btn btn-warning w-full"
    >
      Start Nutridrink
    </button>
    <button
      on:click={addWater}
      class="btn btn-info w-full"
    >
      Add Water Serving
    </button>
    <button
      on:click={takePill}
      disabled={pillTakenToday}
      class="btn btn-success w-full"
    >
      {pillTakenToday ? 'Pill Taken Today ✔️' : 'Take Pill'}
    </button>
  </section>

  <!-- History Section (Placeholder) using DaisyUI Card -->
   <section class="card bg-base-100 shadow-xl">
     <div class="card-body">
       <h2 class="card-title">History</h2>
       <p>Past consumption data will be shown here.</p>
       <!-- TODO: Implement history view using getDataForDay -->
       <div class="card-actions justify-end">
         <!-- Maybe add date navigation buttons here later -->
       </div>
     </div>
   </section>

</main>

<style>
  /* Tailwind handles most styling via DaisyUI */
  /* Add specific overrides or non-DaisyUI styles if needed */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
