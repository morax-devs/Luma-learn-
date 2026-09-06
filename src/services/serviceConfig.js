const configuredSource = import.meta.env.VITE_DATA_SOURCE || 'api'

export const DATA_SOURCE = configuredSource === 'mock' ? 'mock' : 'api'
export const isApiMode = DATA_SOURCE === 'api'
