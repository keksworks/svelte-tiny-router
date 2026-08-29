<script lang="ts">
  import {type RenderableComponent, type RouterContext} from './index'
  import Spinner from './Spinner.svelte'
  import {getContext, onDestroy} from 'svelte'

  let {path = '', component = undefined}: {
    path?: string
    component?: RenderableComponent
  } = $props()

  const ctx = getContext<RouterContext>('router')
  const unregister = ctx.registerRoute(path)
  onDestroy(unregister)

  const params = $derived(ctx.selected?.params)
</script>

{#if ctx.selected?.path === path || (!path && !ctx.selected)}
  {#if $$slots.default}
    <slot {...params}/>
  {:else if component instanceof Promise}
    {#await component}
      <Spinner/>
    {:then comp}
      <svelte:component this={comp.default} {...params}/>
    {/await}
  {:else}
    <svelte:component this={component} {...params}/>
  {/if}
{/if}
