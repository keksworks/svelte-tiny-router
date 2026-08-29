<script lang="ts">
  import {init, activePath, type RenderableComponent, type RouterContext} from './index'
  import {onMount, setContext} from 'svelte'
  import Route from './Route.svelte'

  let {routes = {}, matchedPath = $bindable(undefined)}: {
    routes?: Record<string, {component: RenderableComponent}>
    matchedPath?: string | undefined
  } = $props()

  onMount(init)

  const registered: Record<string, RegExp> = $state({})

  function compilePath(path: string) {
    return new RegExp('^' + path.replace(/(^|\/):([^\/]+)/g, '$1(?<$2>[^/]+)').replace(/(^|\/)\*([^\/]+)/g, '($1(?<$2>.*))?') + '$')
  }

  const selected = $derived.by(() => {
    const current = $activePath
    for (const path in registered) {
      const pattern = registered[path]
      const matched = current.match(pattern)
      if (matched) return {path, params: matched.groups}
    }
  })

  const ctx: RouterContext = {
    registerRoute(path: string) {
      registered[path] = compilePath(path)
      return () => { delete registered[path] }
    },
    get selected() { return selected },
  }
  setContext<RouterContext>('router', ctx)

  $effect(() => { matchedPath = selected?.path })
</script>

{#each Object.entries(routes) as [path, props]}
  <Route {path} {...props}/>
{/each}

<slot/>
