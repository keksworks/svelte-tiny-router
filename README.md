# @keksworks/svelte-tiny-router

A tiny, lightweight router for Svelte applications. Zero dependencies beyond Svelte itself.

## Features

- 🪶 Lightweight - minimal bundle size
- 🎯 Simple API - easy to learn and use
- 🔗 Named parameters - `/user/:id`
- 🌐 Wildcard routes - `/files/*path`
- ⚡ Lazy loading - async component loading with spinner
- 🧩 Slot-based - flexible composition
- 📦 No external dependencies
- 🎯 Single route matching - only the first matching route renders

## Installation

```bash
npm install @keksworks/svelte-tiny-router
```

## Quick Start

### Basic Setup

Wrap your application with `<Router>` and define routes using `<Route>`:

```svelte
<!-- App.svelte -->
<script lang="ts">
  import {Router, Route, Link} from '@keksworks/svelte-tiny-router'
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
</script>

<Router>
  <Route path="/" component={Home}/>
  <Route path="/about" component={About}/>
</Router>
```

### Using Slots

Routes can render content directly using slots:

```svelte
<Router>
  <Route path="/">
    <h1>Welcome Home</h1>
    <p>This is the home page</p>
  </Route>
  
  <Route path="/about">
    <h1>About Us</h1>
    <p>Learn more about us</p>
  </Route>
</Router>
```

### Named Parameters

Extract parameters from the URL using `:paramName` syntax:

```svelte
<Router>
  <Route path="/user/:id" let:id>
    <h1>User Profile</h1>
    <p>User ID: {id}</p>
  </Route>
  
  <Route path="/post/:postId/comments/:commentId" let:postId let:commentId>
    <h1>Comment {commentId} on Post {postId}</h1>
  </Route>
</Router>
```

### Wildcard Routes

Catch-all routes using `*rest` syntax:

```svelte
<Router>
  <Route path="/files/*rest" let:rest>
    <h1>File Browser</h1>
    <p>Path: {rest}</p>
  </Route>
</Router>
```

### Lazy Loading Components

Load components asynchronously with built-in spinner:

```svelte
<Router>
  <Route 
    path="/dashboard" 
    component={() => import('./pages/Dashboard.svelte')}
  />
  
  <Route 
    path="/settings" 
    component={() => import('./pages/Settings.svelte')}
  />
</Router>
```

### Navigation with Links

Use the `<Link>` component for client-side navigation:

```svelte
<script lang="ts">
  import {Link} from '@keksworks/svelte-tiny-router'
</script>

<nav>
  <Link to="/">Home</Link>
  <Link to="/about">About</Link>
  <Link to="/user/42">User Profile</Link>
  <Link to="/settings" class="nav-link">Settings</Link>
  <Link to="/external" target="_blank">External Link</Link>
</nav>
```

### Programmatic Navigation

Navigate programmatically using the `navigate` function:

```svelte
<script lang="ts">
  import {navigate} from '@keksworks/svelte-tiny-router'
  
  function goToProfile() {
    navigate('/user/42')
  }
  
  function replaceCurrent() {
    navigate('/new-page', {replace: true})
  }
  
  function forceRefresh() {
    // Forces a full page reload on next navigate
    // This is useful if you detect app version change and want to update users seamlessly
    refreshOnNextNavigate()
    navigate('/refresh-needed')
  }
</script>

<button onclick={goToProfile}>Go to Profile</button>
```

### Fallback Route (404)

Define a fallback route for unmatched paths:

```svelte
<Router>
  <Route path="/" component={Home}/>
  <Route path="/about" component={About}/>

  <!-- Fallback route (no path specified) -->
  <Route>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist</p>
  </Route>
</Router>
```

## Route Matching

Routes are matched in **DOM order** — the first `<Route>` whose pattern matches the current path will render, and all subsequent routes are ignored. This means you should define more specific routes before generic ones:

```svelte
<Router>
  <!-- ✅ Concrete route first -->
  <Route path="/app/new">
    <NewApp/>
  </Route>

  <!-- ✅ Parameterized route second -->
  <Route path="/app/:id" let:id>
    <AppDetail {id}/>
  </Route>

  <!-- ✅ Wildcard route last -->
  <Route path="/app/*rest" let:rest>
    <AppFallback {rest}/>
  </Route>

  <!-- ✅ Fallback route at the end -->
  <Route>
    <NotFound/>
  </Route>
</Router>
```

With this order:
- `/app/new` → renders `<NewApp/>` only
- `/app/123` → renders `<AppDetail id="123"/>` only
- `/app/some/path` → renders `<AppFallback rest="some/path"/>` only
- `/anything/else` → renders `<NotFound/>` only

## API Reference

### Components

#### `<Router>`

Root component that initializes the router. Must wrap all `<Route>` components.

```svelte
<Router>
  <!-- Your routes here -->
</Router>
```

#### `<Route>`

Defines a route. Can use `component` prop or slot content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | `''` | URL pattern (supports `:param` and `*rest`) |
| `component` | `Component \| Promise` | `undefined` | Component to render or lazy import |

Slot props receive URL parameters:

```svelte
<Route path="/user/:id" let:id>
  <p>User: {id}</p>
</Route>
```

#### `<Link>`

Client-side navigation link.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string` | required | Target URL |
| `target` | `string` | `undefined` | Link target (e.g., `_blank`) |
| `label` | `string` | `''` | Optional label text |

All other props are passed to the underlying `<a>` element.

### Functions

#### `navigate(path, options?)`

Programmatically navigate to a path.

```ts
navigate('/path')
navigate('/path', {replace: true}) // Replace current history entry
```

#### `refreshOnNextNavigate()`

Force a full page reload on the next navigation call.

```ts
refreshOnNextNavigate()
navigate('/needs-refresh') // Will do full page load
```

### Stores

#### `activePath`

Svelte store containing the current path.

```ts
import {activePath} from '@keksworks/svelte-tiny-router'

activePath.subscribe(path => {
  console.log('Current path:', path)
})
```

## Examples

### Complete Application

```svelte
<!-- App.svelte -->
<script lang="ts">
  import {Router, Route, Link} from '@keksworks/svelte-tiny-router'
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import User from './pages/User.svelte'
  import NotFound from './pages/NotFound.svelte'
</script>

<main>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/user/1">User 1</Link>
    <Link to="/user/2">User 2</Link>
  </nav>

  <Router>
    <Route path="/" component={Home}/>
    <Route path="/about" component={About}/>
    <Route path="/user/:id" component={User}/>
    <Route component={NotFound}/>
  </Router>
</main>
```

### Protected Routes

```svelte
<script lang="ts">
  import {Router, Route, navigate} from '@keksworks/svelte-tiny-router'
  import {user} from './stores/auth'
  import Login from './pages/Login.svelte'
  import Dashboard from './pages/Dashboard.svelte'
</script>

<Router>
  <Route path="/login" component={Login}/>
  
  <Route path="/dashboard">
    {#if $user}
      <Dashboard/>
    {:else}
      {@const _ = navigate('/login')}
    {/if}
  </Route>
</Router>
```

### Layout with Sidebar

```svelte
<!-- App.svelte -->
<script lang="ts">
  import {Router, Route, Link} from '@keksworks/svelte-tiny-router'
  import DashboardLayout from './layouts/DashboardLayout.svelte'
</script>

<Router>
  <Route path="/dashboard">
    <DashboardLayout>
      <Route path="/" let:*rest>
        <h1>Dashboard Home</h1>
      </Route>
      <Route path="/settings" let:*rest>
        <h1>Settings</h1>
      </Route>
      <Route path="/profile" let:*rest>
        <h1>Profile</h1>
      </Route>
    </DashboardLayout>
  </Route>
</Router>
```

## License

MIT
