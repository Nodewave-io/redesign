import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRightContained2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRightContained2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.6427 7.18281C11.2891 6.75854 10.6585 6.70121 10.2343 7.05478C9.80998 7.40834 9.75265 8.03891 10.1062 8.46318L11.6427 7.18281ZM14.189 11.8005L14.9572 12.4407C15.2663 12.0698 15.2663 11.5312 14.9572 11.1603L14.189 11.8005ZM10.1062 15.1378C9.75265 15.5621 9.80998 16.1927 10.2343 16.5462C10.6585 16.8998 11.2891 16.8425 11.6427 16.4182L10.1062 15.1378ZM10.1062 8.46318L13.4208 12.4407L14.9572 11.1603L11.6427 7.18281L10.1062 8.46318ZM13.4208 11.1603L10.1062 15.1378L11.6427 16.4182L14.9572 12.4407L13.4208 11.1603ZM12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2V4ZM20 12C20 16.4183 16.4183 20 12 20V22C17.5228 22 22 17.5228 22 12H20ZM12 20C7.58172 20 4 16.4183 4 12H2C2 17.5228 6.47715 22 12 22V20ZM4 12C4 7.58172 7.58172 4 12 4V2C6.47715 2 2 6.47715 2 12H4Z" fill={color}/>
      </svg>
    )
  }
)

export const ArrowRightContained2 = memo(ArrowRightContained2Inner)
ArrowRightContained2.displayName = 'ArrowRightContained2'