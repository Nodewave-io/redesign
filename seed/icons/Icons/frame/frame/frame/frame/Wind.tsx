import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const WindInner = forwardRef<SVGSVGElement, IconProps>(
  function Wind({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.02097 4.7963C9.38093 3.88579 10.2429 3.24463 11.249 3.24463C12.5787 3.24463 13.6567 4.36459 13.6567 5.74613C13.6567 7.12767 12.5787 8.24763 11.249 8.24763H2.3999M14.024 19.2035C14.3839 20.114 15.2459 20.7551 16.252 20.7551C17.5817 20.7551 18.6597 19.6352 18.6597 18.2536C18.6597 16.8721 17.5817 15.7521 16.252 15.7521H7.4029M16.7835 8.54855C17.1575 7.63804 18.0531 6.99688 19.0984 6.99688C20.4799 6.99688 21.5999 8.11684 21.5999 9.49838C21.5999 10.8799 20.4799 11.9999 19.0984 11.9999H4.9014" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Wind = memo(WindInner)
Wind.displayName = 'Wind'