export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  let status = error.statusCode || 500
  let message = error.message || 'An unexpected server error occurred.'

  if (error.type === 'entity.parse.failed') {
    status = 400
    message = 'Invalid JSON payload.'
  } else if (error.name === 'CastError') {
    status = 400
    message = 'The provided ID is invalid.'
  } else if (error.name === 'ValidationError') {
    status = 400
    message = 'The provided data is invalid.'
  } else if (error.code === 11000) {
    status = 409
    message = 'A record with these details already exists.'
  }

  if (process.env.NODE_ENV !== 'production') console.error(error.message)
  res.status(status).json({ success: false, message })
}
