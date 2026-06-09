<script lang="ts">
  import {init, activePath, type MatchState, type RouteProps} from './index'
  import {onMount} from 'svelte'
  import {setContext} from 'svelte'
  import Route from './Route.svelte'

  export let routes: RouteProps[] = []

  onMount(init)

  const matchState: MatchState = {
    claimed: false,
    tryMatch(matched: boolean) {
      return matched && !this.claimed && (this.claimed = true)
    }
  }
  setContext('matchState', matchState)

  $: if ($activePath) matchState.claimed = false
</script>

{#each routes as props}
  <Route {...props}/>
{/each}

<slot/>
