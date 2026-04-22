import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderXInner = forwardRef<SVGSVGElement, IconProps>(
  function FolderX({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.4 15.6L12 13.2M12 13.2L9.59999 10.8M12 13.2L9.59999 15.6M12 13.2L14.4 10.8M2.40093 17.541L2.40102 8.41673C2.40102 7.50281 2.40068 6.20108 2.40039 5.25853C2.40019 4.59561 2.93752 4.05884 3.60044 4.05884H9.31865L12.0837 7.01247H20.4C21.0627 7.01247 21.6 7.54976 21.6 8.21251L21.5997 17.5412C21.5996 18.8666 20.5251 19.9411 19.1997 19.9411L4.80092 19.9411C3.47543 19.9411 2.40091 18.8665 2.40093 17.541Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderX = memo(FolderXInner)
FolderX.displayName = 'FolderX'