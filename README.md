# Luma Learn

A React + Vite e-learning platform portfolio project. The current app includes course discovery, course details, lessons, persisted progress, quizzes, quiz history, dashboard activity, profile editing, and enrollment state.

## Run locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Architecture

```text
React pages and components
	-> hooks and service facades
	-> mock or API adapter
	-> centralized storage / HTTP client
	-> future backend
```

Mock data is only imported by `src/services/mockApi.js`. Pages use service facades such as `courseService`, `quizService`, and `profileService`, so the UI does not depend on the data source.

## Data sources

The default mode is mock mode and makes no network requests. Copy `.env.example` to `.env` when configuring the project locally:

```env
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:3000/api
```

To prepare the frontend for a backend, set `VITE_DATA_SOURCE=api` and provide `VITE_API_BASE_URL`. The API adapters and request contracts live in `src/services/api/`. A backend is not included yet.

## Storage

Browser-only progress, quiz results, enrollments, profile edits, and the demo auth session are stored through `src/utils/storage.js`. They can later be replaced by API-backed service implementations without changing the page components.

## Validation

```bash
npm run lint
npm run build
```
