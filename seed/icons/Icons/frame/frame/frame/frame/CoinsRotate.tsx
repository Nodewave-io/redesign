import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CoinsRotateInner = forwardRef<SVGSVGElement, IconProps>(
  function CoinsRotate({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2 7.80019C10.7457 5.39541 12.8963 3.6002 15.4662 3.6002C18.4486 3.6002 20.8662 6.01786 20.8662 9.00019C20.8662 11.7627 18.7919 14.0407 16.1158 14.3615M6.60005 6.0002L9.00005 3.6002L6.60005 1.2002M1.80005 8.40019V6.8002C1.80005 5.03288 3.23274 3.6002 5.00005 3.6002H7.40005M17.4 18.0002L15 20.4002L17.4 22.8002M22.2 15.6002V17.2002C22.2 18.9675 20.7674 20.4002 19 20.4002H16.6M12.6 16.2002C12.6 19.1825 10.1824 21.6002 7.20005 21.6002C4.21771 21.6002 1.80005 19.1825 1.80005 16.2002C1.80005 13.2179 4.21771 10.8002 7.20005 10.8002C10.1824 10.8002 12.6 13.2179 12.6 16.2002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CoinsRotate = memo(CoinsRotateInner)
CoinsRotate.displayName = 'CoinsRotate'