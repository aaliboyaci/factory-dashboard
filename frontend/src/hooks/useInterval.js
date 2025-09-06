import { useEffect, useRef } from 'react'
export const useInterval = (cb, ms) => {
  const ref = useRef(cb)
  useEffect(() => { ref.current = cb }, [cb])
  useEffect(() => {
    if (ms == null) return
    const id = setInterval(() => ref.current(), ms)
    return () => clearInterval(id)
  }, [ms])
}
