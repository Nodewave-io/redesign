import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderMinus2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderMinus2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.1027 19.9411H4.30361C2.97812 19.9411 1.9036 18.8665 1.90361 17.541L1.9037 8.41673C1.90371 7.50281 1.90337 6.20108 1.90308 5.25853C1.90287 4.59561 2.44021 4.05884 3.10312 4.05884H8.82134L11.5864 7.01247H19.9027C20.5654 7.01247 21.1027 7.54973 21.1027 8.21247V11.4M15.3086 16.5938H22.0968" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderMinus2 = memo(FolderMinus2Inner)
FolderMinus2.displayName = 'FolderMinus2'