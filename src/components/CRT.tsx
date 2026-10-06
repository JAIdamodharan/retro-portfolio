import { ReactNode } from 'react'

// Old beige computer monitor: bezel, curved glass, scanlines, LED and vents.
export default function CRT({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`crt ${className}`}>
      <div className="crt-screen">
        {children}
        <div className="crt-glass" aria-hidden />
      </div>
      <div className="crt-bar" aria-hidden>
        <span>{title}</span><span className="vents" /><i className="led" />
      </div>
    </div>
  )
}
