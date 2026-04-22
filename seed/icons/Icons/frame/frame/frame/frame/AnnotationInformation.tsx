import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AnnotationInformationInner = forwardRef<SVGSVGElement, IconProps>(
  function AnnotationInformation({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 13.125V9.75M12 6.375V6.45959M14.4457 16.3043L12 21L9.75 16.3043H5.25C4.00736 16.3043 3 15.297 3 14.0543V5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V14.0543C21 15.297 19.9926 16.3043 18.75 16.3043H14.4457Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AnnotationInformation = memo(AnnotationInformationInner)
AnnotationInformation.displayName = 'AnnotationInformation'