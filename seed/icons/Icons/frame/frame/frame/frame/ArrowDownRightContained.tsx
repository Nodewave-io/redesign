import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownRightContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownRightContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.2772 9.74681C16.3272 9.19679 15.9218 8.71038 15.3718 8.66038C14.8218 8.61038 14.3354 9.01572 14.2854 9.56574L16.2772 9.74681ZM14.8125 14.8126L14.9031 15.8085C15.3838 15.7647 15.7647 15.3838 15.8084 14.9031L14.8125 14.8126ZM9.5657 14.2854C9.01568 14.3354 8.61034 14.8218 8.66034 15.3718C8.71034 15.9219 9.19675 16.3272 9.74677 16.2772L9.5657 14.2854ZM9.89459 8.48041C9.50406 8.08989 8.8709 8.08989 8.48037 8.48041C8.08985 8.87094 8.08985 9.5041 8.48037 9.89463L9.89459 8.48041ZM14.2854 9.56574L13.8166 14.722L15.8084 14.9031L16.2772 9.74681L14.2854 9.56574ZM14.722 13.8167L9.5657 14.2854L9.74677 16.2772L14.9031 15.8085L14.722 13.8167ZM15.5196 14.1055L9.89459 8.48041L8.48037 9.89463L14.1054 15.5197L15.5196 14.1055ZM20 12C20 16.4183 16.4183 20 12 20V22C17.5228 22 22 17.5228 22 12H20ZM12 20C7.58172 20 4 16.4183 4 12H2C2 17.5228 6.47715 22 12 22V20ZM4 12C4 7.58172 7.58172 4 12 4V2C6.47715 2 2 6.47715 2 12H4ZM12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2V4Z" fill={color}/>
      </svg>
    )
  }
)

export const ArrowDownRightContained = memo(ArrowDownRightContainedInner)
ArrowDownRightContained.displayName = 'ArrowDownRightContained'