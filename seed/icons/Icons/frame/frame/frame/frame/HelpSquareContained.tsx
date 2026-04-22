import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HelpSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function HelpSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 16.4999V16.5395M9.75098 9.22996C9.75098 7.96386 10.7583 6.93748 12.001 6.93748C13.2436 6.93748 14.251 7.96386 14.251 9.22996C14.251 10.4961 13.2436 11.5224 12.001 11.5224C12.001 11.5224 12 12.2067 12 13.0508M21 6.37498L21 17.625C21 19.489 19.489 21 17.625 21H6.375C4.51104 21 3 19.489 3 17.625V6.37498C3 4.51103 4.51104 3 6.375 3H17.625C19.489 3 21 4.51103 21 6.37498Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const HelpSquareContained = memo(HelpSquareContainedInner)
HelpSquareContained.displayName = 'HelpSquareContained'