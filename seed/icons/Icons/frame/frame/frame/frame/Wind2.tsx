import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Wind2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Wind2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 17.9408L4.78892 17.1076C6.89961 16.3715 9.22733 16.602 11.1527 17.7378C13.1085 18.8915 15.4779 19.1102 17.6118 18.3339L21.5999 16.8831M2.3999 12.203L4.78892 11.3698C6.89961 10.6336 9.22733 10.8641 11.1527 11.9999C13.1085 13.1537 15.4779 13.3723 17.6118 12.596L21.5999 11.1452M2.3999 6.46511L4.78892 5.6319C6.89961 4.89578 9.22733 5.12627 11.1527 6.26204C13.1085 7.41582 15.4779 7.63449 17.6118 6.85817L21.5999 5.40736" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Wind2 = memo(Wind2Inner)
Wind2.displayName = 'Wind2'