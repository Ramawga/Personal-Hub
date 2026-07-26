import { CheckSquare, CircleDollarSign, Home, PanelLeft } from 'lucide-react'
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
  routes: AppRoute[]
  onNavigate: (path: string) => void
}

export function Sidebar({ activePath, routes, onNavigate }: SidebarProps) {
  return (
    <aside className="app-sidebar" aria-label="Menu principal">
      <div className="app-sidebar__header">
        <IconButton aria-label="Personal Hub" icon={<PanelLeft size={22} />} />
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
  )
}
