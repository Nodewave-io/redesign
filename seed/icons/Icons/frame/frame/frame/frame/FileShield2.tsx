import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileShield2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileShield2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2 21.5999H7.79995C5.81173 21.5999 4.19995 19.9881 4.19995 17.9999V5.9999C4.19995 4.01168 5.81173 2.3999 7.79995 2.3999H16.2C18.1882 2.3999 19.8 4.01168 19.8 5.9999V8.9999M15.6 7.1999H7.79995M12 10.7999H7.79995M10.2 14.3999H7.79995M13.8 14.6999L15.19 14.0049C16.2035 13.4981 17.3964 13.4981 18.4099 14.0049L19.8 14.6999C19.8 14.6999 19.8 16.8899 19.8 18.0449C19.8 19.1999 18.7323 19.9796 16.8 21.1999C14.8676 19.9796 13.8 18.9499 13.8 18.0449V14.6999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileShield2 = memo(FileShield2Inner)
FileShield2.displayName = 'FileShield2'