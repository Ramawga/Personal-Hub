import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './IconButton.scss'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
}

export function IconButton({ icon, className = '', ...props }: IconButtonProps) {
  return (
    <button className={`icon-button ${className}`.trim()} type="button" {...props}>
      {icon}
    </button>
  )
}
