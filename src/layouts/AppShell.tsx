import { useEffect, useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import useScreenResize from '../hooks/useScreenResize'
import type { AppRoute } from '../routes'
import './AppShell.scss'

type AppShellProps = {
  activeRoute: AppRoute
  routes: AppRoute[]
  onNavigate: (path: string) => void
}

export function AppShell({ activeRoute, routes, onNavigate }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isMobile } = useScreenResize()
  const Page = activeRoute.element

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

  function handleNavigate(path: string) {
    onNavigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`app-shell${isMobileMenuOpen ? ' app-shell--menu-open' : ''}`}>
      <Sidebar
        activePath={activeRoute.path}
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpen={() => setIsMobileMenuOpen(true)}
        routes={routes}
      />
      <main className="app-shell__content">
        <Page />
      </main>
    </div>
  )
}
