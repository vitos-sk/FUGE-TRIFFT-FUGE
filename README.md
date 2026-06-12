# 🏗️ Fuge trifft Fuge — Internes CRM

Internes Verwaltungssystem für ein Fliesenleger-Team. Die Anwendung deckt den gesamten Arbeitsablauf ab: Arbeitszeiterfassung, Objektverwaltung, Fotodokumentation, Analyse-Dashboard und Push-Benachrichtigungen — alles in einer dunklen Oberfläche mit deutschem UI.

---

## 📋 Inhaltsverzeichnis

- [Projektbeschreibung](#-projektbeschreibung)
- [Hauptfunktionen](#-hauptfunktionen)
- [Technologie-Stack](#-technologie-stack)
- [Architektur](#-architektur)
- [Schnellstart](#-schnellstart)
- [Deployment](#-deployment)
- [Projektstruktur](#-projektstruktur)

---

## 🎯 Projektbeschreibung

**Fuge trifft Fuge** ist eine geschlossene PWA für den internen Gebrauch des Teams. Zugang erfolgt rollenbasiert: Administrator und Mitarbeiter.

**Administrator** sieht und verwaltet das gesamte Team:

- Vollständige Übersicht der Arbeitsstunden aller Mitarbeiter mit Excel-Export
- Objektverwaltung (Status, Fotos, Karten, Notizen)
- Dashboard mit Analysen und Wochendiagrammen
- Benutzerverwaltung (Anlegen, Passwort ändern, Löschen)
- Gehaltsberechnung für einen gewählten Zeitraum

**Mitarbeiter** führt eigene Aufzeichnungen:

- Arbeitsstunden mit Objektzuweisung eintragen
- Eigene Einträge nach Monat / Woche / beliebigem Zeitraum einsehen
- Stundenbericht per Knopfdruck in die Zwischenablage kopieren
- Push-Benachrichtigungen bei Änderungen an Objekten

---

## ✨ Hauptfunktionen

**Arbeitszeiterfassung**
- ⏱️ Schichtbeginn/-ende, Pause und Objektzuweisung erfassen
- 📊 Automatische Stundensumme für den gewählten Zeitraum
- 📤 Export nach Excel (XLSX)
- 📋 Textbericht kopieren

**Objekte**
- 🗂️ Objektübersicht mit Statusfilter
- 📸 Fotogalerie mit Upload und Bildkomprimierung
- 🗺️ Adressvorschau auf der Karte
- 🗒️ Notizen zum Objekt
- 📦 Archiv abgeschlossener Objekte

**Dashboard (Admin)**
- 📈 Arbeitsstunden-Diagramme nach Wochen (Recharts)
- 👥 Zusammenfassung je Mitarbeiter

**Benutzersystem (Admin)**
- 🔐 Authentifizierung über Firebase Auth
- 👤 Profil- und Rollenverwaltung
- 🔑 Passwortänderung per E-Mail

**PWA**
- 📱 Als native App auf iOS / Android installierbar
- 🔔 Push-Benachrichtigungen über Firebase Cloud Messaging
- 🌐 Offline-Banner bei Verbindungsverlust

---

## 🛠️ Technologie-Stack

**Frontend**

| Technologie | Version | Zweck |
|---|---|---|
| React | 19.2 | UI-Bibliothek |
| TypeScript | 6.0 | Typisierung |
| Vite | 8.0 | Build-Tool und Dev-Server |
| React Router DOM | 7.15 | Client-seitiges Routing |
| Styled Components | 6.4 | CSS-in-JS Styling |
| Recharts | 3.8 | Dashboard-Diagramme |
| date-fns | 4.1 | Datumsverarbeitung |
| react-dropzone | 15.0 | Drag-and-Drop Foto-Upload |
| browser-image-compression | 2.0 | Bildkomprimierung vor dem Upload |
| xlsx | 0.18 | Excel-Export |
| uuid | 14.0 | ID-Generierung |

**Backend / Infrastruktur**

| Technologie | Zweck |
|---|---|
| Firebase Firestore | NoSQL-Datenbank (Echtzeit) |
| Firebase Auth | Authentifizierung |
| Firebase Storage | Fotospeicher |
| Firebase Cloud Messaging | Push-Benachrichtigungen |
| vite-plugin-pwa | PWA-Manifest und Service Worker |
| Vercel | Hosting und Deployment |

---

## 🏗️ Architektur

Die Anwendung folgt einem **Feature-Sliced**-Ansatz: Code ist nach Domänen aufgeteilt (hours, objects, photos, notes, notifications), jede Domäne enthält eigene Komponenten und Hooks. Seiten sind reine Orchestratoren.

```
Browser
   │  React SPA (PWA)
   │  lazy-loaded pages, React Router
   ▼
Firebase Services
   ├── Firestore (Echtzeit via onSnapshot)
   ├── Auth (Rollenmodell: admin / worker)
   ├── Storage (Objektfotos)
   └── FCM (Push-Benachrichtigungen)
```

**Rollen und Zugriff:**

- `admin` — vollständiger Zugriff auf alle Team-Daten
- `worker` — nur eigene Stunden und gemeinsame Objekte
- Rolle gespeichert in `users/{uid}.role` in Firestore
- Prüfung über `<AdminRoute>` / `<ProtectedRoute>` im Router

**Firebase Firestore — Kollektionen:**

```
users/{uid}                    — Profile (name, role, phone, homeAddress)
objects/{id}                   — Objekte / Projekte
workHours/{id}                 — Arbeitszeiteinträge
photos/{id}                    — Foto-Metadaten
users/{uid}/notifications/{id} — Push-Benachrichtigungen
```

---

## 🚀 Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev

# Produktions-Build erstellen
npm run build
```

Firebase-Umgebungsvariablen werden über `.env` (lokal) oder das Vercel Dashboard (Produktion) gesetzt:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

---

## 🌐 Deployment

Die Anwendung ist auf **Vercel** deployed.

- URL: `fuge-trifft-fuge.vercel.app`
- Repository: `vitos-sk/FUGE-TRIFFT-FUGE`
- `vercel.json` enthält Rewrites auf `index.html` für korrektes SPA-Routing

---

## 📁 Projektstruktur

```
src/
├── pages/
│   ├── LoginPage/          # Anmeldung
│   ├── BoardPage/          # Objektübersicht
│   ├── ObjectDetailPage/   # Objektdetails (Fotos, Notizen, Karte)
│   ├── HoursPage/          # Arbeitszeiterfassung
│   ├── DashboardPage/      # Analysen (Admin)
│   ├── AdminUsersPage/     # Benutzerverwaltung (Admin)
│   └── ArchivePage/        # Objektarchiv
│
├── features/
│   ├── hours/              # Komponenten und Hooks für Stunden
│   ├── objects/            # Komponenten und Hooks für Objekte
│   ├── photos/             # Foto-Upload und Galerie
│   ├── notes/              # Objektnotizen
│   └── notifications/      # Push-Benachrichtigungen
│
├── shared/
│   ├── ui/                 # Wiederverwendbare UI-Komponenten (Button, Modal, Input…)
│   ├── hooks/              # Globale Hooks (useAuth, useOnlineStatus…)
│   ├── services/           # Firebase-Services (hoursService, objectsService…)
│   ├── context/            # AuthContext
│   └── types/              # TypeScript-Interfaces
│
├── constants/              # ROLE, OBJECT_STATUS und weitere Konstanten
├── styles/                 # GlobalStyles, Theme (dunkelgold)
└── App.tsx                 # Router + lazy-loaded Pages
```

---

## 📝 Lizenz

Dieses Projekt ist für den internen Gebrauch erstellt. Nicht für öffentlichen Zugang bestimmt.

---

**Version:** 1.0.0 · **Letzte Aktualisierung:** Juni 2026
