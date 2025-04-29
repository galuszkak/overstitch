<script lang="ts">
  import { onMount } from 'svelte';
  import { getDefaultWaterServingMl } from './storage';

  // Define the expected props, including the callback
  let { onAddWater }: { onAddWater: (amount: number) => void } = $props();

  // Use $state for reactivity
  let servingSizeMl = $state(0);
  const incrementStep = 50;

  onMount(() => {
    servingSizeMl = getDefaultWaterServingMl();
  });

  function increaseServing() {
    servingSizeMl += incrementStep;
  }

  function decreaseServing() {
    if (servingSizeMl > incrementStep) {
      servingSizeMl -= incrementStep;
    } else {
      servingSizeMl = incrementStep;
    }
  }

  function addWater() {
    if (servingSizeMl > 0) {
      // Call the callback prop instead of dispatching
      onAddWater(servingSizeMl);
      servingSizeMl = getDefaultWaterServingMl();
    }
  }
</script>

<div class="flex flex-col items-center space-y-2 p-4 border border-base-300 rounded-lg bg-base-100 h-full justify-between">
  <span class="text-sm font-medium">Add Water Intake</span>
  <div class="join">
    <!-- Use onclick attribute -->
    <button class="btn join-item" onclick={decreaseServing} disabled={servingSizeMl <= incrementStep}>-</button>
    <input
      type="text"
      readonly
      value="{servingSizeMl} ml"
      class="input input-bordered join-item text-center w-28 tabular-nums"
    />
    <!-- Use onclick attribute -->
    <button class="btn join-item" onclick={increaseServing}>+</button>
  </div>
  <!-- Use onclick attribute -->
  <button class="btn btn-info w-full" onclick={addWater} disabled={servingSizeMl <= 0}>
    Add {servingSizeMl} ml
  </button>
</div>

<style>
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
