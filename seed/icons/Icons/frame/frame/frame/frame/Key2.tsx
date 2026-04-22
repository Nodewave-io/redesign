import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Key2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Key2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.00014 8.99962H9.12131M18.001 21.5999L11.3082 15.0022C10.0131 15.5041 8.46564 15.3071 7.02812 14.8865C3.60458 13.885 1.65283 10.3372 2.66878 6.96235C3.68473 3.58746 7.28365 1.66345 10.7072 2.66496C14.1307 3.66647 16.0825 7.21425 15.0665 10.5891L14.9071 11.4545L21.5999 18.0521V21.5999H18.001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Key2 = memo(Key2Inner)
Key2.displayName = 'Key2'