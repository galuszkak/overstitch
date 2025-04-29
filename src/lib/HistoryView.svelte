<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllHistoricalData, type DailyData } from './storage';

  let history: DailyData[] = [];

  onMount(() => {
    history = getAllHistoricalData();
    // Exclude today's data if it exists in the history array
    const todayStr = new Date().toISOString().split('T')[0];
    history = history.filter(day => day.date !== todayStr);
  });

  function formatWater(ml: number): string {
    if (ml === 0) return '0 L';
    return (ml / 1000).toFixed(2) + ' L';
  }

  function formatDate(dateStr: string): string {
    // Basic formatting, could be improved with a date library if needed
    try {
      const date = new Date(dateStr + 'T00:00:00'); // Ensure correct parsing
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", dateStr, e);
      return dateStr; // Fallback
    }
  }
</script>

<div class="card bg-base-200 shadow-xl mt-8">
  <div class="card-body">
    <h2 class="card-title mb-4">History</h2>

    {#if history.length === 0}
      <p class="text-base-content/70 italic">No historical data recorded yet.</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th class="text-center">Nutridrinks</th>
              <th class="text-center">Water</th>
              <th class="text-center">Pill Taken</th>
            </tr>
          </thead>
          <tbody>
            {#each history as day (day.date)}
              <tr>
                <td class="font-medium">{formatDate(day.date)}</td>
                <td class="text-center tabular-nums">{day.completedNutridrinks}</td>
                <td class="text-center tabular-nums">{formatWater(day.waterConsumedMl)}</td>
                <td class="text-center">
                  {#if day.pillTaken}
                    <span class="text-success">✔️</span>
                  {:else}
                    <span class="text-error">❌</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
