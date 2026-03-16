# Projektplan

## Ziel
Eine produktionsnahe Docker-App für Präsentationsanzeige mit Token-geschütztem Adminbereich.

## Lieferumfang
- Upload: `pdf/ppt/pptx`
- Konvertierung nach PDF
- Viewer: Fullscreen + Swipe + Navigation
- Autoplay konfigurierbar (inkl. deaktivierbar)
- Endlosschleife am Präsentationsende
- Docker + Compose + Persistenz
- Tests + CI + Registry-Skripte

## Nächste Ausbaustufen
1. Benutzerverwaltung statt Single-Token
2. Mehrere Präsentationen mit Playlist
3. Zeitgesteuerte Pläne (Tagesprofile)
4. Optionaler Kiosk-Modus im Browser/OS
5. Monitoring/Observability (Prometheus Logs/Metrics)
