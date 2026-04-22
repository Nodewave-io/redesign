import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HeartInner = forwardRef<SVGSVGElement, IconProps>(
  function Heart({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.8065 6.20659C4.70663 5.30673 5.92731 4.80122 7.2001 4.80122C8.47288 4.80122 9.69356 5.30673 10.5937 6.20659L12.0001 7.61179L13.4065 6.20659C13.8493 5.74815 14.3789 5.38247 14.9646 5.13091C15.5502 4.87934 16.18 4.74693 16.8174 4.74139C17.4547 4.73585 18.0868 4.8573 18.6767 5.09865C19.2666 5.34 19.8025 5.69641 20.2532 6.1471C20.7039 6.59778 21.0603 7.13371 21.3016 7.72361C21.543 8.31352 21.6644 8.94558 21.6589 9.58292C21.6534 10.2203 21.5209 10.8501 21.2694 11.4357C21.0178 12.0214 20.6521 12.551 20.1937 12.9938L12.0001 21.1886L3.8065 12.9938C2.90664 12.0937 2.40112 10.873 2.40112 9.60019C2.40112 8.32741 2.90664 7.10673 3.8065 6.20659V6.20659Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Heart = memo(HeartInner)
Heart.displayName = 'Heart'