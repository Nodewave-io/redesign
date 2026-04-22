import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageAddInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageAdd({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.19739 20.9343L15.256 12.4086L19.5188 16.6714M6.19739 20.9343H16.8545C18.6203 20.9343 20.0517 19.5029 20.0517 17.7371V12.4086M6.19739 20.9343C4.43165 20.9343 3.00024 19.5029 3.00024 17.7371V7.08001C3.00024 5.31427 4.43165 3.88287 6.19739 3.88287H13.1245M18.986 9.02859L18.986 6.01429M18.986 6.01429L18.986 3M18.986 6.01429L15.9717 6.01429M18.986 6.01429L22.0002 6.01429M9.39453 8.67858C9.39453 9.56144 8.67882 10.2771 7.79596 10.2771C6.91309 10.2771 6.19739 9.56144 6.19739 8.67858C6.19739 7.79571 6.91309 7.08001 7.79596 7.08001C8.67882 7.08001 9.39453 7.79571 9.39453 8.67858Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageAdd = memo(ImageAddInner)
ImageAdd.displayName = 'ImageAdd'