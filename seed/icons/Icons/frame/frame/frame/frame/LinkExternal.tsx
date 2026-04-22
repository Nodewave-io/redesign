import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LinkExternalInner = forwardRef<SVGSVGElement, IconProps>(
  function LinkExternal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.875 3H6.375C4.51104 3 3 4.51103 3 6.37498V17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V13.1249M15.3744 3.00027L21 3M21 3V8.06261M21 3L11.4367 12.5622" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LinkExternal = memo(LinkExternalInner)
LinkExternal.displayName = 'LinkExternal'