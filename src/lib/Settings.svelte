<script lang="ts">
  import { onMount } from 'svelte';
  import { getDefaultWaterServingMl, saveDefaultWaterServingMl } from './storage';

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

</script>

<div class="card bg-base-200 shadow-xl mt-8">
  <div class="card-body">
    <h2 class="card-title">Settings</h2>

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
  </div>
</div>

<style>
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
