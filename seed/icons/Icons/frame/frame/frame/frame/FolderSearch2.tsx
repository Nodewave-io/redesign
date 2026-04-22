import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderSearch2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderSearch2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.0837 19.9411H4.80093C3.47543 19.9411 2.40091 18.8665 2.40093 17.541L2.40102 8.41673C2.40102 7.50281 2.40068 6.20108 2.40039 5.25853C2.40019 4.59561 2.93752 4.05884 3.60044 4.05884H9.31865L12.0837 7.01247H20.4C21.0627 7.01247 21.6 7.54973 21.6 8.21247V11.4M19.8 18.6L21 19.8M20.4 16.2C20.4 17.8569 19.0568 19.2 17.4 19.2C15.7431 19.2 14.4 17.8569 14.4 16.2C14.4 14.5432 15.7431 13.2 17.4 13.2C19.0568 13.2 20.4 14.5432 20.4 16.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderSearch2 = memo(FolderSearch2Inner)
FolderSearch2.displayName = 'FolderSearch2'