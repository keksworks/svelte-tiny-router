<script lang="ts">
  import {init, activePath, type MatchState} from './index'
  import {onMount} from 'svelte'
  import {setContext} from 'svelte'

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

<slot/>
