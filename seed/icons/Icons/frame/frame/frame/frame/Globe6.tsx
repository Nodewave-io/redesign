import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Globe6Inner = forwardRef<SVGSVGElement, IconProps>(
  function Globe6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.25 20.7165C12.5309 20.9016 11.7769 21 11 21C6.02944 21 2 16.9706 2 12C2 7.02944 6.02944 3 11 3C15.5896 3 19.3768 6.4354 19.9304 10.875M3.125 15.375H5.75C6.78554 15.375 7.625 14.5355 7.625 13.5V11.0625C7.625 10.027 8.46447 9.1875 9.5 9.1875H11.375C12.4105 9.1875 13.25 8.34804 13.25 7.3125V4.125M18.9196 17.6457L21.496 16.755C21.9789 16.588 21.9951 15.911 21.5207 15.7212L15.133 13.1657C14.6887 12.988 14.2442 13.4215 14.4108 13.8702L16.8441 20.4217C17.0219 20.9005 17.6987 20.9015 17.878 20.4233L18.9196 17.6457Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Globe6 = memo(Globe6Inner)
Globe6.displayName = 'Globe6'