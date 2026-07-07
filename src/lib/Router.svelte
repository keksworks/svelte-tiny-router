<script lang="ts">
  import {init, activePath, type MatchState, type RenderableComponent, type AnyComponent} from './index'
  import {onMount, setContext} from 'svelte'
  import Route from './Route.svelte'

  export let routes: Record<string, {component: RenderableComponent}> = {}
  export let matchedPath: string | undefined = undefined
  export let noMatch: AnyComponent | undefined = undefined

  onMount(init)

  const matchState: MatchState = {
    tryMatch(matched: boolean, path: string) {
      return matched && !this.matched && !!(matchedPath = path) && (matchState.matched = true)
    }
  }
  setContext('matchState', matchState)

  $: if ($activePath) matchedPath = matchState.matched = undefined
</script>

{#each Object.entries(routes) as [path, props]}
  <Route {path} {...props}/>
{/each}

<slot/>

{#if matchedPath === undefined && noMatch}
  <svelte:component this={noMatch}/>
{/if}
