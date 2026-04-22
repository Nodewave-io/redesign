import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ComponentInner = forwardRef<SVGSVGElement, IconProps>(
  function Component({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.3996 3.24868C11.7312 2.91711 12.2688 2.91711 12.6004 3.24868L15.0223 5.67058C15.3538 6.00215 15.3538 6.53975 15.0223 6.87132L12.6004 9.29322C12.2688 9.6248 11.7312 9.6248 11.3996 9.29322L8.97773 6.87132C8.64616 6.53975 8.64616 6.00215 8.97773 5.67058L11.3996 3.24868Z" stroke={color} strokeWidth="2"/>
        <path d="M17.1287 8.97773C17.4603 8.64615 17.9978 8.64616 18.3294 8.97773L20.7513 11.3996C21.0829 11.7312 21.0829 12.2688 20.7513 12.6004L18.3294 15.0223C17.9978 15.3538 17.4603 15.3538 17.1287 15.0223L14.7068 12.6004C14.3752 12.2688 14.3752 11.7312 14.7068 11.3996L17.1287 8.97773Z" stroke={color} strokeWidth="2"/>
        <path d="M5.67058 8.97773C6.00216 8.64615 6.53975 8.64616 6.87132 8.97773L9.29322 11.3996C9.6248 11.7312 9.6248 12.2688 9.29322 12.6004L6.87132 15.0223C6.53975 15.3538 6.00215 15.3538 5.67058 15.0223L3.24868 12.6004C2.91711 12.2688 2.91711 11.7312 3.24868 11.3996L5.67058 8.97773Z" stroke={color} strokeWidth="2"/>
        <path d="M11.3996 14.7068C11.7312 14.3752 12.2688 14.3752 12.6004 14.7068L15.0223 17.1287C15.3538 17.4603 15.3538 17.9978 15.0223 18.3294L12.6004 20.7513C12.2688 21.0829 11.7312 21.0829 11.3996 20.7513L8.97773 18.3294C8.64616 17.9978 8.64616 17.4603 8.97773 17.1287L11.3996 14.7068Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Component = memo(ComponentInner)
Component.displayName = 'Component'