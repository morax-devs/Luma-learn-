function getEmbedUrl(url) {
  if (!url) return null
  try {
    const trimmed = url.trim()
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
    }
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    return trimmed
  } catch {
    return url
  }
}

export function LessonPlayer({ course, lesson, isComplete }) {
  const embedUrl = getEmbedUrl(lesson?.videoUrl)
  const isDirectVideo = embedUrl && (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg'))

  if (embedUrl) {
    return (
      <div className="lesson-player video-active">
        {isDirectVideo ? (
          <video className="lesson-video-element" src={embedUrl} controls title={lesson?.title} />
        ) : (
          <iframe
            className="lesson-video-frame"
            src={embedUrl}
            title={lesson?.title || 'Lesson video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    )
  }

  const thumbClass = (course?.thumbnail || 'ai').toLowerCase()
  return (
    <div className={`lesson-player art-${thumbClass}`}>
      <div className="player-grid" />
      <div className="player-center">
        <button className="player-play" aria-label={`Play ${lesson?.title || 'lesson'}`}>▶</button>
        <span>Preview lesson</span>
      </div>
      <div className="player-course-mark">{course?.thumbnail || 'AI'}</div>
      <div className="player-label">
        <span>MODULE LESSON</span>
        <strong>{isComplete ? 'Completed' : 'Ready to learn'}</strong>
      </div>
      <div className="player-controls">
        <span>0:00</span>
        <div className="player-progress"><i /></div>
        <span>{lesson?.duration || '10 min'}</span>
        <button aria-label="Toggle fullscreen">⛶</button>
      </div>
    </div>
  )
}
