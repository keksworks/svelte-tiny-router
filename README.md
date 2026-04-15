# @keksworks/svelte-tiny-router

A tiny, lightweight router for Svelte applications. Zero dependencies.

## Features

- 🪶 Minimal bundle size
- 🔗 Named parameters (`/user/:id`) and wildcard routes (`/files/*path`)
- ⚡ Lazy loading with built-in spinner
- 🎯 Single route matching — only the first matching route renders
- 📦 No external dependencies
- Supports Svelte 5 and Svelte 4

## Installation

```bash
npm install @keksworks/svelte-tiny-router
```

## Quick Start

```svelte
<script lang="ts">
  import {Router, Route, Link, navigate} from '@keksworks/svelte-tiny-router'
  import Home from './pages/Home.svelte'
  import User from './pages/User.svelte'
</script>

<nav>
  <Link to="/">Home</Link>
  <Link to="/user/42">User 42</Link>
  <a on:click|preventDefault={() => navigate('/about')}>About</a>
</nav>

<Router>
  <Route path="/" component={Home}/>
  <Route path="/user/:id" component={User}/>
  <Route path="/app/new"><NewApp/></Route>
  <Route path="/app/:id" let:id><AppDetail {id}/></Route>
  <Route path="/app/*rest" let:rest><AppFallback {rest}/></Route>
  <Route component={() => import('./pages/NotFound.svelte')}/>
</Router>
```

Routes match in **DOM order** — the first match wins. Define concrete routes before parameterized/wildcard ones. See [src/lib/test/RouterMatchTest.svelte](src/lib/test/RouterMatchTest.svelte) for a full example.

## API

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `<Router>` | — | Wraps all routes, initializes routing |
| `<Route>` | `path`, `component` | Defines a route. Slot receives URL params via `let:` |
| `<Link>` | `to`, `target`, ... | Client-side navigation link |

### Functions

| Function | Description |
|----------|-------------|
| `navigate(path, {replace?})` | Programmatic navigation |
| `refreshOnNextNavigate()` | Force full page reload on next navigate |

### Stores

| Store | Description |
|-------|-------------|
| `activePath` | Current path |

## Examples

- **Basic routing** with links and params: [src/lib/test/RouterTest.svelte](src/lib/test/RouterTest.svelte)
- **Route matching** with concrete, param, wildcard, and 404 routes: [src/lib/test/RouterMatchTest.svelte](src/lib/test/RouterMatchTest.svelte)

## License

MIT
