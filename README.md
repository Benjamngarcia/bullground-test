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

**Cuenta de prueba**

Se puede crear una cuenta desde la aplicación web, pero si quieren probar más fácil pueden entrar con:

- email: benja@bullground.com
- pass: 123456
---



## Justificación de decisiones técnicas

### Por qué Supabase

- Supabase ofrece Postgres, autenticación, APIs y tooling razonable “out of the box”, lo que permite iterar muy rápido sin montar infraestructura desde cero.
- Encaja bien con un modelo de datos sencillo centrado en:
  - `conversations` y `messages` con relaciones claras.
  - Posible uso futuro de RLS y multi-tenant si el proyecto creciera
- Tradeoff:
  - A cambio de velocidad de desarrollo, se acepta depender de un BaaS y de su modelo de permisos. Para un challenge técnico tan extenso en 2 días es una ventaja clara.

### Por qué Express + TypeScript en el backend

- Express es mínimo, conocido y suficientemente flexible para un API de chat sin sobre-ingeniería. 
- TypeScript añade seguridad en el contrato entre backend, frontend y mobile (tipos compartidos de `Message`, `Conversation`, etc.)

### Por qué Gemini como LLM

- Gemini es un LLM generalista que encaja bien para generar respuestas largas y explicativas, ideal para un “asesor financiero” que debe razonar y matizar sus respuestas.
- La integración se encapsula en un servicio de LLM, por lo que se podría cambiar por otro proveedor si hiciera falta.
- Tradeoff:
  - Se priorizó la simplicidad de integración ya que el objetivo aquí es demostrar flujo conversacional coherente, no construir un stack de IA completo.

### Por qué React + Vite + TypeScript en el frontend

- React + Vite permite:
  - Arranque muy rápido
  - Integración limpia con TypeScript y tooling moderno.
- La UI se enfocó en:
  - Flujo de chat cómodo (scroll controlado, estados de carga, errores).
  - Microinteracciones ligeras en vez de animaciones pesadas
- Tradeoff:
  - No se usó un design system completo ni una librería de componentes pesada para mantener el código más transparente y centrado en el flujo de chat.

### Por qué Expo + React Native en mobile

- Expo da un flujo “baterías incluidas” para:
  - Correr en iOS/Android sin peleas de configuración nativa.
  - Integrar fácilmente herramientas como Expo Router, manejo de env, assets, etc
- React Native + TypeScript facilita compartir tipos con la web y el backend (el mismo shape de Message)
- Tradeoff:
  - Se eligió el workflow managed de Expo en lugar de un setup customizado para ahorrar tiempo de configuración nativa