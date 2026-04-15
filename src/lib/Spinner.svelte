<script lang="ts">
  export let size = 24
  export let color = 'currentColor'

  $: halfSize = size / 2
</script>

<svg class="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx={halfSize} cy={halfSize} r={halfSize - 2} stroke={color} stroke-width="2" stroke-linecap="round" stroke-dasharray="30 70" fill="none"/>
</svg>

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
