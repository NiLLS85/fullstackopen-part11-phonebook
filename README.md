# Agenda telefónica con pipeline de CI/CD (Full Stack Open, parte 11, ejercicio 21)

La agenda de las partes 2 y 3 de Full Stack Open, ahora en un solo repositorio (backend en la raíz y frontend en `frontend/`) y con su propio pipeline de GitHub Actions.

**Versión publicada:** <https://phonebook-fso-t3uq.onrender.com> (plan gratis de Render, con la base de datos en MongoDB Atlas; la primera visita tras un rato sin uso puede tardar unos 50 segundos en despertar).

Los demás ejercicios de la parte 11 están en [NiLLS85/fullstackopen-part11](https://github.com/NiLLS85/fullstackopen-part11).

## Pipeline

`.github/workflows/pipeline.yml` se ejecuta en cada push a `main` y en cada pull request:

1. **lint_and_test:** ESLint del backend y del frontend, pruebas de la API con `node:test` y supertest contra un MongoDB de GitHub Actions (contenedor `mongo:7`), pruebas de componentes con Vitest y Testing Library, y compilación del frontend.
2. **e2e_tests:** pruebas de extremo a extremo con Playwright contra el servidor en modo de pruebas.
3. **deploy:** solo en `main` y si ningún commit lleva `#skip`. Avisa a Render con un *deploy hook* guardado como secreto (`RENDER_DEPLOY_HOOK`). Render comprueba `/health` antes de dar por buena la versión nueva.
4. **tag_release:** sube la versión (patch por defecto) y crea la etiqueta con `anothrNick/github-tag-action`, fijada por hash.

Además, `.github/workflows/health-check.yml` comprueba una vez al día que la versión publicada responde en `/health` (con varios reintentos, porque el plan gratis de Render tarda en despertar). También se puede lanzar a mano desde la pestaña Actions.

En Render el servicio usa la raíz del repositorio, con `npm install && npm run build` como comando de compilación (instala el backend y compila el frontend en `frontend/dist`, que sirve Express) y `npm start` para arrancar. El despliegue automático de Render está apagado: solo despliega el pipeline.

La rama `main` está protegida: los cambios entran por pull request, con las comprobaciones en verde y la revisión de otra persona.

## Estructura

| Ruta | Qué hay |
|---|---|
| `app.js`, `index.js` | Aplicación Express y arranque del servidor |
| `controllers/` | Rutas de `/api/persons` y, solo en pruebas, `/api/testing/reset` |
| `models/person.js` | Modelo de Mongoose con validación del nombre y del número |
| `utils/` | Configuración (base de datos real o de pruebas) y middleware |
| `tests/` | Pruebas de la API |
| `e2e-tests/` | Pruebas de Playwright |
| `frontend/` | Interfaz con React y Vite |

## Comandos

```bash
cp .env.example .env            # y pon tus cadenas de conexión de MongoDB
npm install && npm run build    # instala todo y compila el frontend
npm run dev                     # servidor en http://localhost:3001
npm run lint
npm test                        # pruebas de la API (necesita TEST_MONGODB_URI)
npm run test:frontend
npm run test:e2e
```

## Uso de IA

Este ejercicio se hizo con ayuda de un asistente de IA (Claude, de Anthropic), bajo mi dirección. El asistente escribió la mayor parte de la configuración, de las pruebas y de la reorganización del código, y lo comprobó con el pipeline de GitHub Actions.
