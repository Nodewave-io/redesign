import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GraduationCapInner = forwardRef<SVGSVGElement, IconProps>(
  function GraduationCap({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.43074 11.968L11.3648 15.5044C11.6802 15.6923 12.0732 15.6923 12.3886 15.5044L21.9726 9.79291C22.298 9.599 22.298 9.12779 21.9726 8.93388L12.3886 3.22242C12.0732 3.03445 11.6802 3.03445 11.3648 3.22241L1.7808 8.93388C1.45542 9.12779 1.45542 9.599 1.7808 9.79291L5.43074 11.968ZM5.43074 11.968L5.43074 18.2114C5.43074 18.5535 5.6056 18.8719 5.89429 19.0554L10.8423 22.2006C11.477 22.6041 12.2845 22.6173 12.9321 22.2349L18.3241 19.051C18.6287 18.8711 18.8157 18.5436 18.8157 18.1899L18.8157 11.968" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const GraduationCap = memo(GraduationCapInner)
GraduationCap.displayName = 'GraduationCap'