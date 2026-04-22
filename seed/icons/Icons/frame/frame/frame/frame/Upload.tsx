import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UploadInner = forwardRef<SVGSVGElement, IconProps>(
  function Upload({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.89286 15.4289C4.29518 15.4289 3 14.4291 3 12.9631C3 11.4972 4.29518 10.3088 5.89286 10.3088C6.0015 10.3088 6.10875 10.3143 6.21429 10.325V10.3088H6.25407C6.22781 10.1155 6.21429 9.91866 6.21429 9.71889C6.21429 7.11272 8.51682 5 11.3571 5C13.2805 5 14.9573 5.96881 15.8395 7.40361C16.0551 7.37452 16.2756 7.35945 16.5 7.35945C18.9853 7.35945 21 9.20808 21 11.4885C21 13.3657 19.6348 14.7967 17.7656 15.2684M11.858 19V12.2258M11.858 12.2258L8.90625 15.0196M11.858 12.2258L14.8125 15.0196" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Upload = memo(UploadInner)
Upload.displayName = 'Upload'