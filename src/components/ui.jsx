import { Link } from 'react-router-dom'

export function Button({ children, variant = 'primary', to, type = 'button', className = '', ...props }) {
  const classes = `button button-${variant} ${className}`.trim()
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>
  return <button className={classes} type={type} {...props}>{children}</button>
}

export function Card({ children, className = '' }) {
  return <section className={`card ${className}`.trim()}>{children}</section>
}

export function PageContainer({ children, className = '' }) {
  return <main className={`page-container ${className}`.trim()}>{children}</main>
}

export function ProgressBar({ value, label = 'Progress' }) {
  return (
    <div className="progress-wrap">
      <div className="progress-meta"><span>{label}</span><strong>{value}%</strong></div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function LoadingState() {
  return <div className="state-panel"><span className="loading-dot" /> Loading your learning space...</div>
}

export function ErrorState({ message = 'We could not load this content right now.', onRetry }) {
  return <div className="state-panel error-state"><span className="empty-mark">!</span><h3>Something went wrong</h3><p>{message}</p>{onRetry && <button className="button button-secondary" onClick={onRetry}>Try again</button>}</div>
}

export function EmptyState({ title = 'Nothing here yet', description = 'Your next learning milestone will appear here.', action }) {
  return (
    <div className="state-panel">
      <span className="empty-mark">+</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div className="state-action" style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  )
}
