import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 20) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CursorArrowInner = forwardRef<SVGSVGElement, IconProps>(
  function CursorArrow({ size = 20, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill={color} {...props}>
        <path d="M13.9231 16.0296C14.0985 16.4505 13.9299 18.0447 13 18.4142C12.0701 18.7837 10.882 18.4142 10.882 18.4142L8.72605 14.1024L5 17.8284V1L16.4142 12.4142H12.1615C12.3702 12.8144 13.7003 15.4948 13.9231 16.0296Z" fill={color}/>
        <path fillRule="evenodd" clipRule="evenodd" d="M6 3.41421V15.4142L9 12.4142L11.5 17.4142C11.5 17.4142 12.1763 17.63 12.5 17.4142C12.8237 17.1984 13.1457 16.7638 13 16.4142C12.3123 14.7638 10.5 11.4142 10.5 11.4142H14L6 3.41421Z" fill={color}/>
      </svg>
    )
  }
)

export const CursorArrow = memo(CursorArrowInner)
CursorArrow.displayName = 'CursorArrow'