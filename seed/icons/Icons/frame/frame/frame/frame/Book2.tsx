import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Book2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Book2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.7256 20.2286V5.4172M11.7256 20.2286L10.2681 18.7712C9.44512 17.9481 8.32937 17.4858 7.16545 17.4858H3.49609C2.89016 17.4858 2.3999 16.9946 2.3999 16.3886V4.86863C2.3999 4.26269 2.89111 3.77148 3.49704 3.77148H7.71352C8.87745 3.77148 9.9937 4.23385 10.8167 5.05687L11.7256 5.96577L12.6345 5.05687C13.4575 4.23385 14.5738 3.77148 15.7377 3.77148H20.5028C21.1087 3.77148 21.5999 4.26269 21.5999 4.86863V16.3886C21.5999 16.9946 21.1087 17.4858 20.5028 17.4858H16.2863C15.1224 17.4858 14.0061 17.9481 13.1831 18.7712L11.7256 20.2286Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Book2 = memo(Book2Inner)
Book2.displayName = 'Book2'