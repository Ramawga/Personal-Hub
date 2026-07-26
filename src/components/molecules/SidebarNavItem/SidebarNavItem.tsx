import type { LucideIcon } from 'lucide-react'
import './SidebarNavItem.scss'

type SidebarNavItemProps = {
  icon: LucideIcon
  isActive: boolean
  label: string
  onClick: () => void
}

export function SidebarNavItem({
  icon: Icon,
  isActive,
  label,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      className={`sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" size={21} strokeWidth={2.1} />
      <span>{label}</span>
    </button>
  )
}
