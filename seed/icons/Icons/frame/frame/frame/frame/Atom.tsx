import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AtomInner = forwardRef<SVGSVGElement, IconProps>(
  function Atom({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9997 12.0902V11.9999M20.9624 20.9626C19.0667 22.8583 13.5173 20.3824 8.5674 15.4325C3.6175 10.4826 1.14159 4.93312 3.03729 3.03742C4.933 1.14171 10.4825 3.61762 15.4323 8.56752C20.3822 13.5174 22.8582 19.0669 20.9624 20.9626ZM3.03749 20.9626C1.14178 19.0669 3.61769 13.5175 8.56759 8.56758C13.5175 3.61768 19.0669 1.14177 20.9626 3.03747C22.8583 4.93318 20.3824 10.4826 15.4325 15.4325C10.4826 20.3824 4.93319 22.8583 3.03749 20.9626Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Atom = memo(AtomInner)
Atom.displayName = 'Atom'