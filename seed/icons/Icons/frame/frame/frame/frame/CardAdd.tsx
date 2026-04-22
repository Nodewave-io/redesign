import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardAddInner = forwardRef<SVGSVGElement, IconProps>(
  function CardAdd({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.8403 18.6397H4.24059C2.91513 18.6397 1.84063 17.5652 1.84059 16.2397L1.84033 7.23991C1.84029 5.9144 2.91482 4.83984 4.24033 4.83984H18.6398C19.9653 4.83984 21.0398 5.91374 21.0398 7.23926L21.0399 11.4398M2.43987 9.0397H20.4399M19.6336 19.16L19.6336 16.6338M19.6336 16.6338L19.6336 14.1076M19.6336 16.6338H17.1074M19.6336 16.6338H22.1598" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardAdd = memo(CardAddInner)
CardAdd.displayName = 'CardAdd'