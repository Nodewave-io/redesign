import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BellOff2Inner = forwardRef<SVGSVGElement, IconProps>(
  function BellOff2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20 16.7144C19.4287 15.8601 18.8738 14.6009 18.8738 13.0824L18.8984 11.0054C18.8984 6.88537 15.8322 3.54545 12.05 3.54545C11.6431 3.54545 11.2446 3.58468 10.8576 3.65984M15.8067 17.7271H4.51081C4.08656 17.7271 3.84961 17.0648 4.10623 16.6968C4.70172 15.8429 5.27648 14.5905 5.27648 13.0824L5.30104 10.8971C5.30104 9.14486 5.86379 7.53582 6.80316 6.27273M9.36666 21H14.7333M17.9533 20.4545L5.61 3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const BellOff2 = memo(BellOff2Inner)
BellOff2.displayName = 'BellOff2'