import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderSearchInner = forwardRef<SVGSVGElement, IconProps>(
  function FolderSearch({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.4 15.6L15.6 16.8M2.40093 17.541L2.40102 8.41673C2.40102 7.50281 2.40068 6.20108 2.40039 5.25853C2.40019 4.59561 2.93752 4.05884 3.60044 4.05884H9.31865L12.0837 7.01247H20.4C21.0627 7.01247 21.6 7.54976 21.6 8.21251L21.5997 17.5412C21.5996 18.8666 20.5251 19.9411 19.1997 19.9411L4.80092 19.9411C3.47543 19.9411 2.40091 18.8665 2.40093 17.541ZM15 13.2C15 14.8569 13.6568 16.2 12 16.2C10.3431 16.2 8.99999 14.8569 8.99999 13.2C8.99999 11.5432 10.3431 10.2 12 10.2C13.6568 10.2 15 11.5432 15 13.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderSearch = memo(FolderSearchInner)
FolderSearch.displayName = 'FolderSearch'