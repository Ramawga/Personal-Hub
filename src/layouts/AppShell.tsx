import { Sidebar } from '../components/organisms/Sidebar'
import type { AppRoute } from '../routes'
import './AppShell.scss'

type AppShellProps = {
  activeRoute: AppRoute
  routes: AppRoute[]
  onNavigate: (path: string) => void
}

export function AppShell({ activeRoute, routes, onNavigate }: AppShellProps) {
  const Page = activeRoute.element

  return (
    <div className="app-shell">
      <Sidebar activePath={activeRoute.path} routes={routes} onNavigate={onNavigate} />
      <main className="app-shell__content">
        <Page />
      </main>
    </div>
  )
}
