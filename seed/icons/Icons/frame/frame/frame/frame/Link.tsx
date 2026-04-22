import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LinkInner = forwardRef<SVGSVGElement, IconProps>(
  function Link({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.0115 7.45264L6.85292 7.45264C5.67327 7.45264 4.53155 7.91599 3.6943 8.76564C2.85705 9.61528 2.38138 10.7545 2.40046 11.971C2.38133 13.1875 2.85719 14.3269 3.6943 15.1764C4.55051 16.0453 5.65413 16.5088 6.83382 16.5088H9.9924M13.9883 16.5474H17.1469C18.3265 16.5474 19.4683 16.084 20.3055 15.2344C21.1428 14.3847 21.6184 13.2455 21.5993 12.029C21.5993 10.8319 21.1237 9.69263 20.2864 8.84298C19.4492 7.99333 18.3266 7.51062 17.1469 7.5106H13.9883M7.25235 11.9578L16.7281 11.9578" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Link = memo(LinkInner)
Link.displayName = 'Link'