<script lang="ts">
  import {Route, Router} from '../index'
  import NotFound from './NotFound.svelte'
</script>

<Router>
  <Route path="/">
    <h1>Home Page</h1>
  </Route>
  <Route path="/app/new">
    <h1>New App Page</h1>
  </Route>
  <Route path="/app/:id" let:id>
    <h1>App Detail {id}</h1>
  </Route>
  <Route path="/app/*rest" let:rest>
    <h1>App Wildcard {rest}</h1>
  </Route>
  <Route path="/about">
    <h1>About Page</h1>
  </Route>
  <Route component={NotFound}/>
</Router>
