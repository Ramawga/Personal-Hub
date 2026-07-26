import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { FinancesPage } from '../pages/FinancesPage'
import { HomePage } from '../pages/HomePage'
import { TodosPage } from '../pages/TodosPage'
import { routeLabels } from './routeLabels'

export type AppRoute = {
  element: () => React.JSX.Element | null
  id: 'home' | 'finances' | 'todos'
  label: string
  path: string
}

export const appRoutes: AppRoute[] = [
  {
    element: HomePage,
    id: 'home',
    label: routeLabels.home,
    path: '/',
  },
  {
    element: FinancesPage,
    id: 'finances',
    label: routeLabels.finances,
    path: '/financas',
  },
  {
    element: TodosPage,
    id: 'todos',
    label: routeLabels.todos,
    path: '/a-fazeres',
  },
]

function subscribeToLocationChange(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange)

  return () => window.removeEventListener('popstate', onStoreChange)
}

function getCurrentPath() {
  return window.location.pathname
}

export function useAppRoute(routes: AppRoute[]) {
  const currentPath = useSyncExternalStore(
    subscribeToLocationChange,
    getCurrentPath,
    () => '/',
  )

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === currentPath) ?? routes[0],
    [currentPath, routes],
  )

  useEffect(() => {
    if (activeRoute.path !== currentPath) {
      window.history.replaceState(null, '', activeRoute.path)
    }
  }, [activeRoute.path, currentPath])

  function navigateTo(path: string) {
    if (path === window.location.pathname) {
      return
    }

    window.history.pushState(null, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return {
    activeRoute,
    navigateTo,
  }
}
