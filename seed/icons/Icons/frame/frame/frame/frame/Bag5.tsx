import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Bag5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Bag5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.6003 6.30004L2.40091 6.29976L2.39966 6.3001M21.6003 6.30004L21.5997 19.6161C21.5997 20.8775 20.5577 21.9001 19.2724 21.9001H4.72693C3.44161 21.9001 2.39966 20.8775 2.39966 19.6161V6.3001M21.6003 6.30004L17.7511 2.45157C17.5261 2.22653 17.2209 2.1001 16.9026 2.1001H7.09671C6.77845 2.1001 6.47323 2.22653 6.24819 2.45157L2.39966 6.3001M15.5997 9.9001C15.5997 11.8883 13.9879 13.5001 11.9997 13.5001C10.0114 13.5001 8.39966 11.8883 8.39966 9.9001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bag5 = memo(Bag5Inner)
Bag5.displayName = 'Bag5'