import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '../content'
import CRT from './CRT'

export default function CaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const s = project?.study
  useEffect(() => {
    if (!s) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [s, onClose])

  return (
    <AnimatePresence>
      {project && s && (
        <motion.div className="modal study-modal" role="dialog" aria-modal="true" aria-label={`${project.title} case study`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="modal-box study-box" onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <CRT title="CASE_STUDY_01.EXE">
              <div className="study">
                <p className="kicker">{s.kicker}</p>
                <h2>{project.title}</h2>
                <p className="stack">{s.stack}</p>

                <h4>&gt; PROBLEM</h4>
                <p>{s.problem}</p>

                <h4>&gt; APPROACH</h4>
                <ol className="pipe">{s.steps.map(t => <li key={t}>{t}</li>)}</ol>

                <h4>&gt; DATA</h4>
                <p>{s.data.source}</p>
                <div className="split" role="img" aria-label={s.data.split.map(([n, v]) => `${n} ${v}%`).join(', ')}>
                  {s.data.split.map(([n, v]) => <span key={n} style={{ flexGrow: v }}>{n} {v}%</span>)}
                </div>
                <p className="muted">{s.data.note}</p>

                <h4>&gt; RESULT</h4>
                <div className="tiles">{s.results.map(([v, l]) => <div key={l}><strong>{v}</strong><small>{l}</small></div>)}</div>
                <p>{s.checks}</p>
                <p>{s.shipped}</p>

                {project.repo && <a className="repo" href={project.repo} target="_blank" rel="noopener noreferrer">VIEW CODE ↗</a>}
              </div>
            </CRT>
            <button ref={closeRef} className="pbtn tiny modal-x" onClick={onClose} aria-label="Close case study">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
