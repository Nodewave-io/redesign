import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ColorSwatch2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ColorSwatch2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3332 21.6C16.2016 21.6 15.1164 21.1505 14.3162 20.3503C13.5161 19.5502 13.0666 18.4649 13.0666 17.3334V4.53336C13.0666 3.96756 13.2913 3.42494 13.6914 3.02486C14.0915 2.62479 14.6341 2.40002 15.1999 2.40002H19.4666C20.0324 2.40002 20.575 2.62479 20.9751 3.02486C21.3751 3.42494 21.5999 3.96756 21.5999 4.53336V17.3334C21.5999 18.4649 21.1504 19.5502 20.3502 20.3503C19.5501 21.1505 18.4648 21.6 17.3332 21.6ZM17.3332 21.6H4.53324C3.96744 21.6 3.42482 21.3753 3.02474 20.9752C2.62466 20.5751 2.3999 20.0325 2.3999 19.4667V15.2C2.3999 14.6342 2.62466 14.0916 3.02474 13.6915C3.42482 13.2915 3.96744 13.0667 4.53324 13.0667H6.98657M13.0666 7.04002L10.9332 4.90669C10.5332 4.50675 9.99065 4.28208 9.42497 4.28208C8.85928 4.28208 8.31676 4.50675 7.9167 4.90669L4.90017 7.92322C4.50023 8.32328 4.27556 8.86581 4.27556 9.43149C4.27556 9.99717 4.50023 10.5397 4.90017 10.9398L14.5002 20.5398M17.3332 17.3334V17.344" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ColorSwatch2 = memo(ColorSwatch2Inner)
ColorSwatch2.displayName = 'ColorSwatch2'