import { CheckSquare, CircleDollarSign, Home, Menu, PanelLeft, X } from 'lucide-react'
import { IconButton } from '../../atoms/IconButton'
import { SidebarNavItem } from '../../molecules/SidebarNavItem'
import type { AppRoute } from '../../../routes'
import './Sidebar.scss'

const routeIcons = {
  home: Home,
  finances: CircleDollarSign,
  todos: CheckSquare,
}

type SidebarProps = {
  activePath: string
  isMobileMenuOpen: boolean
  onClose: () => void
  routes: AppRoute[]
  onNavigate: (path: string) => void
  onOpen: () => void
}

export function Sidebar({
  activePath,
  isMobileMenuOpen,
  onClose,
  onNavigate,
  onOpen,
  routes,
}: SidebarProps) {
  return (
    <>
      <header className="mobile-header">
        <IconButton aria-label="Abrir menu" icon={<Menu size={24} />} onClick={onOpen} />
        <strong>Personal Hub</strong>
      </header>

      <aside
        className={`app-sidebar${isMobileMenuOpen ? ' app-sidebar--open' : ''}`}
        aria-label="Menu principal"
      >
        <div className="app-sidebar__header">
          <IconButton
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Personal Hub'}
            icon={isMobileMenuOpen ? <X size={22} /> : <PanelLeft size={22} />}
            onClick={isMobileMenuOpen ? onClose : undefined}
          />
          <strong>Personal Hub</strong>
        </div>

        <nav className="app-sidebar__nav">
          {routes.map((route) => (
            <SidebarNavItem
              icon={routeIcons[route.id]}
              isActive={route.path === activePath}
              key={route.path}
              label={route.label}
              onClick={() => onNavigate(route.path)}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}
