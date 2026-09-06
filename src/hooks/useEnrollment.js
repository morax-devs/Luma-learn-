import { useEffect, useState } from 'react'
import { enrollmentService, ENROLLMENT_EVENT } from '../services/enrollmentService'

export function useEnrollment(courseId) {
  const [enrolled, setEnrolled] = useState(() => enrollmentService.isEnrolled(courseId))
  useEffect(() => {
    const sync = () => setEnrolled(enrollmentService.isEnrolled(courseId))
    window.addEventListener(ENROLLMENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(ENROLLMENT_EVENT, sync); window.removeEventListener('storage', sync) }
  }, [courseId])
  return { enrolled, enroll: () => { enrollmentService.enroll(courseId); setEnrolled(true) } }
}
