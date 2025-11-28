**Bullground — Proyecto (Frontend, Backend, Mobile)**

Hola! Esta es la recreación en web y mobile de Bullground Advisors usando un LLM.

**Estructura del repositorio**
- `frontend/` — Aplicación web (React + Vite + TypeScript).
- `backend/` — API en Node/Express (TypeScript) que usa Supabase y Gemini.
- `bullground-mobile/` — App móvil (Expo / React Native + TypeScript).

![[Web App](assets/screenshots/web-screenshot.jpeg)](https://github.com/Benjamngarcia/bullground-test/blob/main/assets/screenshots/web_screenshot.jpeg)
![[Mobile App](assets/screenshots/mobile-screenshot.jpeg)](https://github.com/Benjamngarcia/bullground-test/blob/main/assets/screenshots/mobile_screenshot.jpeg)


---

**Qué hace este proyecto (resumen rápido)**
- Frontend: interfaz para gestionar conversaciones con un agente financiero (ver historial, enviar mensajes, ver métricas y charts -hardcodeados).
- Backend: autenticación, conversaciones y mensajería; persiste datos en Supabase y llama a Gemini para generar respuestas del asistente.
- Mobile: app cliente (Expo) que replica la experiencia de chat y funciones básicas del dashboard.

**Requisitos (lo que debes tener instalado)**
- Node.js (versión LTS recomendada, ej. 18+).
- npm o yarn.
- Para mobile: Expo CLI (opcional, se puede correr con `npx expo`), y simuladores/emuladores (Xcode, Android Studio) o Expo Go en tu teléfono.
---

**Variables de entorno (por proyecto)**

Notas: Se necesitan todas estas env, si se requiere correr rápido el proyecto solictarme envs.

- `backend/.env` (recomendado)
  - `PORT=3000`
  - `SUPABASE_URL`= tu URL de Supabase
  - `SUPABASE_SERVICE_ROLE_KEY`= tu anon/service role key (según uso)
  - `JWT_SECRET`= clave para firmar tokens JWT
  - `GEMINI_API_KEY`= clave de la API de Gemini (u otro proveedor LLM)
  - `GEMINI_MODEL_ID`= clave del modelo de Gemini a usar.
  - `NODE_ENV=development`

- `frontend/.env` (recomendado)
  - `VITE_API_BASE_URL`= URL del backend (ej. `http://localhost:3000`)

- `bullground-mobile/.env` (recomendado — en Expo suele usarse `app.json` o `expo-constants`)
  - `EXPO_PUBLIC_API_URL`= URL del backend (ej. `http://10.0.2.2:3000` o la IP local)

---

Instalación y comandos (paso a paso)

1) Backend (API)

```bash
cd backend
npm install
npm run dev
```

2) Frontend (web)

```bash
cd frontend
npm install
npm run dev
```

3) Mobile (Expo)

```bash
cd bullground-mobile
npm install
npm run ios
```
---
