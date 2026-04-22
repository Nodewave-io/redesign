import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ShuffleInner = forwardRef<SVGSVGElement, IconProps>(
  function Shuffle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 18.3325H5.79472C6.88468 18.3325 7.90755 17.8061 8.54107 16.9192L9.50058 15.5759M20.3023 6.47176H17.5076C16.4176 6.47176 15.3948 6.99814 14.7612 7.88508L13.6875 9.38832M18.6545 4L21 6.47176L18.6545 8.94352M18.6545 15.9165L21 18.3882L18.6545 20.86M3 6.85337H5.79472C6.88468 6.85337 7.90755 7.37975 8.54107 8.26669L14.7612 16.9749C15.3948 17.8619 16.4176 18.3882 17.5076 18.3882H20.3023" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Shuffle = memo(ShuffleInner)
Shuffle.displayName = 'Shuffle'