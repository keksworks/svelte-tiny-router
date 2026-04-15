import {beforeEach} from 'vitest'
import {cleanup} from '@testing-library/svelte'

beforeEach(() => {
  cleanup()
  history.replaceState({}, '', '/')
})

import {fireEvent, render} from '@testing-library/svelte'
import RouterTest from './test/RouterTest.svelte'
import RouterMatchTest from './test/RouterMatchTest.svelte'
import {navigate} from './index'
import {tick} from 'svelte'

test('render and navigate', async () => {
  const {container} = render(RouterTest)
  expect(container.innerHTML).toContain('Home Page')
  await fireEvent.click(container.querySelector('a')!)
  expect(container.innerHTML).toContain('About Page')
  navigate('/user/42')
  await tick()
  expect(container.innerHTML).toContain('User 42')
})

test('single route matching - concrete route should not match parameterized route', async () => {
  const {container} = render(RouterMatchTest)

  // Test concrete route /app/new
  navigate('/app/new')
  await tick()
  expect(container.innerHTML).toContain('New App Page')
  expect(container.innerHTML).not.toContain('App Detail')
  expect(container.innerHTML).not.toContain('App Wildcard')

  // Test parameterized route /app/:id
  navigate('/app/123')
  await tick()
  expect(container.innerHTML).toContain('App Detail 123')
  expect(container.innerHTML).not.toContain('New App Page')
  expect(container.innerHTML).not.toContain('App Wildcard')

  // Test wildcard route /app/*rest
  navigate('/app/some/deep/path')
  await tick()
  expect(container.innerHTML).toContain('App Wildcard some/deep/path')
  expect(container.innerHTML).not.toContain('New App Page')
  expect(container.innerHTML).not.toContain('App Detail')

  // Test not found route
  navigate('/nonexistent')
  await tick()
  expect(container.innerHTML).toContain('404 Not Found')
  expect(container.innerHTML).not.toContain('Home Page')
  expect(container.innerHTML).not.toContain('App Detail')

  // Test wildcard matches without the wildcard part
  navigate('/app')
  await tick()
  expect(container.innerHTML).toContain('App Wildcard')
  expect(container.innerHTML).not.toContain('New App Page')
  expect(container.innerHTML).not.toContain('App Detail')
})
