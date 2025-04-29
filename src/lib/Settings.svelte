<script lang="ts">
  import { onMount } from 'svelte';
  import { getDefaultWaterServingMl, saveDefaultWaterServingMl, resetAllData } from './storage'; // Import resetAllData

  let currentDefaultMl: number = 0;
  let initialDefaultMl: number = 0;

  onMount(() => {
    currentDefaultMl = getDefaultWaterServingMl();
    initialDefaultMl = currentDefaultMl; // Store initial value for comparison
  });

  function increaseDefault() {
    currentDefaultMl += 50;
  }

  function decreaseDefault() {
    if (currentDefaultMl > 50) { // Prevent going below 50ml
      currentDefaultMl -= 50;
    }
  }

  function saveSettings() {
    saveDefaultWaterServingMl(currentDefaultMl);
    initialDefaultMl = currentDefaultMl; // Update initial value after saving
    // Optionally, dispatch an event or use a store if other components need immediate notification
  }

  $: hasChanges = currentDefaultMl !== initialDefaultMl;

  function handleResetData() {
    if (window.confirm("Are you sure you want to reset ALL data? This cannot be undone.")) {
      resetAllData();
      // Reload the page to reflect the cleared state
      window.location.reload();
    }
  }

</script>

<div class="card bg-base-200 shadow-xl mt-8">
  <div class="card-body">
    <h2 class="card-title">Settings</h2>

    <!-- Default Water Serving Size -->
    <div class="form-control">
      <label class="label" for="defaultWater">
        <span class="label-text">Default Water Serving Size (ml)</span>
      </label>
      <div class="join">
        <button class="btn join-item" on:click={decreaseDefault} disabled={currentDefaultMl <= 50}>-</button>
        <input
          id="defaultWater"
          type="text"
          readonly
          value="{currentDefaultMl} ml"
          class="input input-bordered join-item text-center w-32 tabular-nums"
        />
        <button class="btn join-item" on:click={increaseDefault}>+</button>
      </div>
       <p class="text-xs text-base-content/70 mt-1">Adjust in 50ml increments.</p>
    </div>

    <div class="card-actions justify-end mt-4">
      <button class="btn btn-primary" on:click={saveSettings} disabled={!hasChanges}>
        Save Settings
      </button>
    </div>

    <!-- Reset Data Section -->
    <div class="divider"></div>
    <div class="form-control mt-4">
        <label class="label">
            <span class="label-text font-semibold">Danger Zone</span>
        </label>
        <p class="text-xs text-base-content/70 mb-2">Resetting will permanently delete all your tracked data (Nutridrinks, water, pills) and settings.</p>
        <button class="btn btn-error" on:click={handleResetData}>
            Reset All Data
        </button>
    </div>

  </div>
</div>

<style>
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
