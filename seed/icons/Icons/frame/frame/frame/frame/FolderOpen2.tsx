import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderOpen2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderOpen2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.5788 10.4843V7.4422C19.5788 6.88991 19.1311 6.4422 18.5788 6.4422H11.9089C11.6436 6.4422 11.3893 6.33684 11.2017 6.1493L9.76648 4.71404C9.57894 4.5265 9.32459 4.42114 9.05937 4.42114H3.3999C2.84762 4.42114 2.3999 4.86886 2.3999 5.42114V18.579C2.3999 19.1313 2.84762 19.579 3.3999 19.579H4.57607C5.0485 19.579 5.43148 19.1961 5.43148 18.7236C5.43148 18.6211 5.44993 18.5193 5.48595 18.4233L8.21973 11.1332C8.36609 10.7429 8.73922 10.4843 9.15606 10.4843H20.2125C20.895 10.4843 21.377 11.153 21.1612 11.8005L18.7962 18.8953C18.6601 19.3036 18.278 19.579 17.8476 19.579H4.42095" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderOpen2 = memo(FolderOpen2Inner)
FolderOpen2.displayName = 'FolderOpen2'