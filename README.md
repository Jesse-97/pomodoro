# Pomodoro Study Assistant

Pomodoro Study Assistant is a productivity-focused web app that blends structured focus sessions, break-time mini games, and lightweight planning tools in a single interface. It is designed to reduce context switching during study sessions by keeping timer control, ambient audio, and break activities in one flow.

## Product Overview

The app is built around three core views:

- Focus: A configurable Pomodoro timer with immersive mode.
- Games: Break-only mini games that remain locked during focus sessions.
- Calendar: A month view with per-day task tracking and completion heatmap.

This structure supports a full cycle of deep work, intentional breaks, and simple daily planning.

## Core Features

### Timer and Session Modes

- Preset session durations:
  - Focus: 25 minutes
  - Short Break: 5 minutes
  - Long Break: 15 minutes
- Circular progress ring with mode-specific colors.
- Start behavior enters immersive fullscreen timer mode.
- Immersive mode intentionally strips UI down to timer and Stop action.
- Stop exits immersive mode and returns to the standard timer screen.

### Ambient Background Audio

- Built-in audio options:
  - Soft Classical Music
  - White Noise
  - Rain Sounds
  - Silence
- Smooth audio transitions between session mode changes.
- Option persistence across refreshes via local storage.

### Break-Time Game Suite

- Game access is locked while in focus mode.
- Available games:
  - Typing (monkeytype-style character feedback)
  - Whack-A-Mole
  - Memory
  - Snake
  - Timing
  - Flappy Bird
- Compact mini timer remains visible while a game is active.

### Calendar and Task Tracking

- Interactive monthly calendar with day selection.
- Per-day task list with add, complete, and delete actions.
- Completion percentage heatmap on each calendar day.
- Task data persists in browser local storage.

### Theme and UX

- Persistent Light/Dark theme toggle.
- Token-based styling system for cohesive visual theming.
- Responsive layout across desktop and mobile.
- Motion-enhanced transitions for focus-state changes.

## Technical Stack

- Frontend Framework: React 19
- Build Tooling: Vite 8
- Language: JavaScript (ES Modules)
- Styling: CSS with design tokens and component-scoped styles
- Linting: ESLint with React Hooks rules
- Browser APIs:
  - Web Audio API (procedural ambient sound engine)
  - Local Storage (theme, audio preference, calendar tasks)

## Architecture Summary

### Application Composition

- App-level state manages:
  - Active tab (Focus, Games, Calendar)
  - Session mode (focus, short, long)
  - Theme preference
  - Global background audio preference
- Timer logic is encapsulated in a reusable timer hook.
- Background audio is handled by a shared audio engine hook.

### Major Modules

- Timer module:
  - Standard timer card UI
  - Immersive fullscreen timer state
  - Progress ring rendering
- Games module:
  - Game navbar and lock behavior
  - Game container orchestration
  - Individual mini game implementations
- Calendar module:
  - Month generation and date selection
  - Task CRUD and completion metrics

## Design Goals

- Keep user attention on one action at a time.
- Make session state obvious at a glance.
- Support recovery and continuity with persistent preferences.
- Keep feature complexity moderate while preserving a playful break experience.

## Future Direction

- Session analytics and trend reporting.
- Historical performance metrics for typing and games.
- Optional cloud sync for tasks and preferences.
- Expanded accessibility settings (font scaling, reduced motion options).

## Author

Kathy Jane Leo

Inspired by the Pomodoro Technique and modern study-focused productivity workflows.
