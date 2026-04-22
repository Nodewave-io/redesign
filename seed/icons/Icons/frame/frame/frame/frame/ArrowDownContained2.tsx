import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownContained2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownContained2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.8172 11.6427C17.2415 11.2891 17.2988 10.6585 16.9452 10.2343C16.5917 9.80998 15.9611 9.75265 15.5368 10.1062L16.8172 11.6427ZM12.1995 14.189L11.5593 14.9572C11.9302 15.2663 12.4688 15.2663 12.8397 14.9572L12.1995 14.189ZM8.86218 10.1062C8.4379 9.75265 7.80734 9.80998 7.45377 10.2343C7.10021 10.6585 7.15753 11.2891 7.58181 11.6427L8.86218 10.1062ZM15.5368 10.1062L11.5593 13.4208L12.8397 14.9572L16.8172 11.6427L15.5368 10.1062ZM12.8397 13.4208L8.86218 10.1062L7.58181 11.6427L11.5593 14.9572L12.8397 13.4208ZM20 12C20 16.4183 16.4183 20 12 20V22C17.5228 22 22 17.5228 22 12H20ZM12 20C7.58172 20 4 16.4183 4 12H2C2 17.5228 6.47715 22 12 22V20ZM4 12C4 7.58172 7.58172 4 12 4V2C6.47715 2 2 6.47715 2 12H4ZM12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2V4Z" fill={color}/>
      </svg>
    )
  }
)

export const ArrowDownContained2 = memo(ArrowDownContained2Inner)
ArrowDownContained2.displayName = 'ArrowDownContained2'