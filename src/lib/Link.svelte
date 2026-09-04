<script lang="ts">
  import {router} from './index'

  export let to: string
  export let target: string|undefined = undefined
  export let label = ''
</script>

<a href={to} {target} use:router {...$$restProps} class={$$props.class ?? 'text-link'}>
  <slot/>
  {#if label}<span>{label}</span>{/if}
</a>
