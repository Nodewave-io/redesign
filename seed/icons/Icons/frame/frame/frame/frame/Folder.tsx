import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderInner = forwardRef<SVGSVGElement, IconProps>(
  function Folder({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.40093 8.41673L2.40084 17.941C2.40083 19.0456 3.29626 19.9411 4.40084 19.9411L19.5996 19.9411C20.7041 19.9411 21.5995 19.0457 21.5996 17.9412L21.5999 8.0125C21.5999 7.46021 21.1522 7.01247 20.5999 7.01247H12.0836L9.31857 4.05884H3.40028C2.84785 4.05884 2.40007 4.50605 2.40024 5.05848C2.40055 6.0093 2.40094 7.43621 2.40093 8.41673Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Folder = memo(FolderInner)
Folder.displayName = 'Folder'