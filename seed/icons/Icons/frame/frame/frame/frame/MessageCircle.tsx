import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageCircleInner = forwardRef<SVGSVGElement, IconProps>(
  function MessageCircle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.2338 15.6356C20.7253 14.5238 20.9983 13.2938 20.9983 12C20.9983 7.02944 16.9692 3 11.9991 3C7.02906 3 3 7.02944 3 12C3 16.9706 7.02906 21 11.9991 21C13.5993 21 15.1019 20.5823 16.4039 19.85L21 20.9991L20.2338 15.6356Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageCircle = memo(MessageCircleInner)
MessageCircle.displayName = 'MessageCircle'