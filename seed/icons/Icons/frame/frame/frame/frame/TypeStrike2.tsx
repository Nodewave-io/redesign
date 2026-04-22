import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TypeStrike2Inner = forwardRef<SVGSVGElement, IconProps>(
  function TypeStrike2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4 12H10.7996L14.7088 12M14.7088 12C17.2125 12 19.2417 14.0147 19.2417 16.5C19.2417 18.9853 17.212 21 14.7084 21H11.9336C9.19211 21 6.90524 19.0676 6.38008 16.5M14.7088 12L21 12M19.2414 8.625C19.2414 5.5184 16.7043 3 13.5747 3H10.8C8.29631 3 6.26667 5.01472 6.26667 7.5V8.625" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TypeStrike2 = memo(TypeStrike2Inner)
TypeStrike2.displayName = 'TypeStrike2'