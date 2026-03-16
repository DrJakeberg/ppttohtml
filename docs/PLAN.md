# Project Plan

## Goal
Production-ready Docker app for presentation display with token-protected admin panel.

## Scope
- Upload: `pdf/ppt/pptx`
- Conversion to PDF
- Viewer: fullscreen + swipe + manual navigation
- Configurable autoplay (including disabled mode)
- End-of-deck loop behavior
- Docker + Compose + persistent storage
- Tests + CI + registry scripts

## Next Iterations
1. User accounts instead of single token
2. Multiple presentations with playlist support
3. Scheduled playback profiles
4. Optional kiosk mode (browser/OS level)
5. Monitoring/observability (logs + metrics)
