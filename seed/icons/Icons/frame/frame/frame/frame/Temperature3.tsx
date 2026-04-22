import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Temperature3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Temperature3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.7 17.3999H8.75625M14.7 10.7999L15.1119 10.6296C15.7486 10.3665 16.4637 10.3671 17.1 10.6312C17.7363 10.8953 18.4514 10.8959 19.0881 10.6327L19.5 10.4625M14.7 6.93729L15.1119 6.76705C15.7486 6.50391 16.4637 6.50446 17.1 6.7686C17.7363 7.03273 18.4514 7.03328 19.0881 6.77014L19.5 6.5999M12.9 17.3999C12.9 19.7195 11.0196 21.5999 8.7 21.5999C6.3804 21.5999 4.5 19.7195 4.5 17.3999C4.5 15.9727 5.21191 14.7117 6.3 13.9527V4.79833C6.3 3.47285 7.37452 2.3999 8.7 2.3999C10.0255 2.3999 11.1 3.47442 11.1 4.7999V13.9527C11.9592 14.7218 12.9 16.156 12.9 17.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Temperature3 = memo(Temperature3Inner)
Temperature3.displayName = 'Temperature3'