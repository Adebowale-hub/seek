# SEEK // Geographic Course Creation & Exploration

**SEEK** is a modern, responsive single-page React web application designed for outdoor enthusiasts, runners, cyclists, and trail explorers. It features a dominant **~70% viewport map** powered by **Leaflet / React-Leaflet**, zero-config **OSRM & OpenStreetMap** APIs (with seamless **Mapbox** token upgrade support), reverse geocoding, elevation profile charts, and GPX/GeoJSON export.

![SEEK Preview](public/favicon.svg)

---

## 🌟 Key Features

1. **70% Viewport Map Layout**:
   - Map takes ~70% of screen width on desktop and dominant view on mobile with an expandable bottom sheet drawer.
   - Support for multiple map tile layers: **CartoDB Dark Matter**, **CartoDB Voyager**, **OpenStreetMap**, **Esri World Imagery**, and **Mapbox Dark/Outdoors**.

2. **2-Click Course Creation Flow**:
   - **Click 1 (Point A)**: Sets pulsing green compass start pin + address lookup.
   - **Click 2 (Point B)**: Sets finish pin, triggers OSRM/Mapbox routing engine, draws glowing polyline, and loads course metrics.

3. **API-Driven Metrics & Features**:
   - **Geocoding Search**: Real-time place search with debounced Nominatim/Mapbox autosuggest dropdown.
   - **Reverse Geocoding**: Click anywhere on map to fetch street address.
   - **Routing Engine**: Live OSRM / Mapbox route calculation for **Walking/Hiking**, **Cycling**, and **Driving**.
   - **Elevation Profile**: Interactive SVG sparkline chart detailing terrain slope and peak elevation.
   - **⚡ Find Fastest Route**: 1-click speed optimization across all transport modes.

4. **Persistence & Exporting**:
   - Save custom courses locally in `localStorage`.
   - 1-click export any course as **GPX** or **GeoJSON** for GPS devices and mapping tools.
   - Pre-loaded scenic trails (e.g. Emerald Coast Ridge Walk, Central Park Loop).

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
cd maps
npm install
```

### 2. Configure Environment Variables (Optional)

Out of the box, SEEK runs with **zero setup or required keys** using OpenStreetMap, CartoDB, Nominatim, and OSRM public services.

If you wish to upgrade map tiles and routing to **Mapbox**, create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Add your Mapbox Public Token:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1Ioi...
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

The production-ready static assets will be output to the `dist/` directory.

---

## 🌐 How to Host the Web App (Free Cloud Hosting)

Since SEEK builds static HTML/JS/CSS files into the `dist/` directory, you can host it for free on any modern web host:

### Option A: Vercel (Recommended - Zero Config)

1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository. Vercel automatically detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your app will be live on a `https://your-app.vercel.app` URL!

Or via CLI:
```bash
npm i -g vercel
vercel
```

---

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com) and connect your GitHub repo.
2. Set Build Command: `npm run build` and Publish Directory: `dist`.
3. Click **Deploy Site**.

Or via CLI:
```bash
npx netlify-cli deploy --prod --dir=dist
```

---

### Option C: GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```
2. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`.

---

## 📱 How to Convert into a Mobile App (Android & iOS)

You can wrap this web app into a native mobile app using **Capacitor**:

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "SEEK Pathfinder" "com.seek.mapapp" --web-dir dist
```

### Step 2: Add Native Platforms (Android / iOS)

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### Step 3: Build Web Assets & Sync

```bash
npm run build
npx cap sync
```

### Step 4: Open in Android Studio / Xcode to Run or Publish

```bash
# Open Android Studio (to generate APK or publish to Google Play Store)
npx cap open android

# Open Xcode (to generate iOS app or publish to Apple App Store)
npx cap open ios
```

---

## 🖥️ How to Convert into a Desktop App (Windows / macOS / Linux)

You can package this web app into a native desktop `.exe` installer or Mac `.dmg` using **Electron**:

```bash
# 1. Install Electron
npm install -D electron electron-builder

# 2. Add build script in package.json to generate executable
npx electron-builder
```

---

## 🛠️ Project Structure

```
maps/
├── public/
│   └── favicon.svg             # App compass icon
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx      # Top bar with logo, place search, theme toggle & help button
│   │   ├── Map/
│   │   │   ├── MapView.jsx     # Main Leaflet map container
│   │   │   ├── MapControls.jsx # Floating map toolbar (layers, recenter, locate GPS)
│   │   │   ├── RoutePolyline.jsx # Glowing route polyline & draft preview line
│   │   │   └── LocationMarker.jsx # Custom SVG start and finish markers
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx     # Desktop side panel (~30%) / Mobile drawer
│   │   │   ├── CourseDetails.jsx # Active course metrics, elevation chart & save form
│   │   │   ├── CourseList.jsx  # Saved courses library with search filter & exports
│   │   │   ├── SearchBar.jsx   # Geocoding search input
│   │   │   └── PresetTrails.jsx# Curated scenic courses
│   │   └── Modals/
│   │       └── HelpModal.jsx   # 3-step user guide modal
│   ├── hooks/
│   │   ├── useMapState.js      # Map viewport, tile providers & draft state
│   │   └── useCourses.js       # LocalStorage CRUD & export handlers
│   ├── services/
│   │   ├── routingService.js   # OSRM & Mapbox Directions API wrapper
│   │   ├── geocodingService.js # Nominatim & Mapbox Geocoding wrapper
│   │   └── storageService.js   # localStorage & GPX/GeoJSON downloader
│   ├── theme/
│   │   ├── themeConfig.js      # Tile provider configs & travel modes
│   │   └── index.css           # Tailwind directives, Leaflet popups & glassmorphism
│   ├── App.jsx                 # Main application layout
│   └── main.jsx                # React root entry point
├── .env.example                # Environment variables template
├── vite.config.js              # Vite & Tailwind setup
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

---

## 💻 Tech Stack

- **React 19**: Functional components & custom hooks.
- **Vite**: Ultra-fast frontend bundler.
- **Leaflet & React-Leaflet**: High-performance interactive mapping engine.
- **Tailwind CSS v4**: Nature-inspired exploration design with glassmorphism & dark mode support.
- **Lucide React**: Crisp vector iconography.
