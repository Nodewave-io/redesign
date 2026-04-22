import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Password2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Password2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.52879 9.30234H6.66882M11.9999 9.30234H12.1399M17.3294 9.30234H17.4694M11.3999 14.7023H4.53324C3.35503 14.7023 2.3999 13.7472 2.3999 12.569V6.03568C2.3999 4.85747 3.35503 3.90234 4.53324 3.90234H19.4666C20.6448 3.90234 21.5999 4.85747 21.5999 6.03568V9.30234M15.4111 13.5974L16.8011 12.9024C17.8146 12.3957 19.0076 12.3957 20.0211 12.9024L21.4111 13.5974C21.4111 13.5974 21.4111 15.7874 21.4111 16.9424C21.4111 18.0974 20.3434 18.8771 18.4111 20.0974C16.4788 18.8771 15.4111 17.8474 15.4111 16.9424V13.5974Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Password2 = memo(Password2Inner)
Password2.displayName = 'Password2'