<script lang="ts">
  import type {Component} from 'svelte'
  import {activePath, type MatchState} from './index'
  import Spinner from './Spinner.svelte'
  import {getContext} from 'svelte'

  type AnyComponent = Component<any, any, any>

  export let path = ''
  export let component: AnyComponent | Promise<{default: AnyComponent}> | undefined = undefined

  const matchState = getContext<MatchState>('matchState')

  $: p = new RegExp('^' + path.replace(/(^|\/):([^\/]+)/g, '$1(?<$2>[^/]+)').replace(/(^|\/)\*([^\/]+)/g, '($1(?<$2>.*))?') + '$')
  $: matched = $activePath.match(p)
  $: params = matched?.groups
</script>

{#if matchState.tryMatch(!!matched) || !path && !matchState.claimed}
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
