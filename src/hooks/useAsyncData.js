import { useCallback, useEffect, useState } from 'react'

export function useAsyncData(loader, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [retryCount, setRetryCount] = useState(0)
  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  useEffect(() => {
    let active = true
    Promise.resolve().then(loader).then((data) => {
      if (active) setState({ data, loading: false, error: null })
    }).catch(() => {
      if (active) setState({ data: null, loading: false, error: new Error('Unable to load this content.') })
    })
    return () => { active = false }
  // Loader identity is intentionally controlled by the caller's dependency list.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, retryCount])

  return { ...state, retry }
}
