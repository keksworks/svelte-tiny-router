<script lang="ts">
  import {init, activePath, type RenderableComponent, type RouterContext} from './index'
  import {onMount, setContext} from 'svelte'
  import Route from './Route.svelte'

  let {routes = {}, matchedPath = $bindable(undefined)}: {
    routes?: Record<string, {component: RenderableComponent}>
    matchedPath?: string | undefined
  } = $props()

  onMount(init)

  const registered: string[] = $state([])

  const selected = $derived.by(() => {
    const current = $activePath
    for (const path of registered) {
      if (!path) continue
      const p = new RegExp('^' + path.replace(/(^|\/):([^\/]+)/g, '$1(?<$2>[^/]+)').replace(/(^|\/)\*([^\/]+)/g, '($1(?<$2>.*))?') + '$')
      const matched = current.match(p)
      if (matched) return {path, params: matched.groups}
    }
    return undefined
  })

  const ctx: RouterContext = {
    registerRoute(path: string) {
      registered.push(path)
      return () => registered.splice(registered.indexOf(path), 1)
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
