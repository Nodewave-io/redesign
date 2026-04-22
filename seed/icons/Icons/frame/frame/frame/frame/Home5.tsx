import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Home5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Home5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.3812 10.875L18.75 9.24488V5.25C18.75 4.63125 18.2438 4.125 17.625 4.125H16.5C15.8812 4.125 15.375 4.63125 15.375 5.25V5.87212L13.125 3.62438C12.8179 3.33413 12.5366 3 12 3C11.4634 3 11.1821 3.33413 10.875 3.62438L3.61875 10.875C3.26775 11.2406 3 11.5073 3 12C3 12.6334 3.486 13.125 4.125 13.125H5.25V19.875C5.25 20.4938 5.75625 21 6.375 21H8.625C9.24632 21 9.75 20.4963 9.75 19.875V15.375C9.75 14.7562 10.2562 14.25 10.875 14.25H13.125C13.7438 14.25 14.25 14.7562 14.25 15.375V19.875C14.25 20.4963 14.1912 21 14.8125 21H17.625C18.2438 21 18.75 20.4938 18.75 19.875V13.125H19.875C20.514 13.125 21 12.6334 21 12C21 11.5073 20.7322 11.2406 20.3812 10.875Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Home5 = memo(Home5Inner)
Home5.displayName = 'Home5'