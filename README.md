# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## Project-specific notes (Doc-Flow frontend)

This section covers where to look and how to contribute for features that pair with backend services: analytics charts, working hours UI, workflow widgets, and the chatbot.

- **Analytics charts**:
  - Frontend analytics pages are under [src/pages/analytics](src/pages/analytics) with the main entry [src/pages/analytics/AnalyticsPage.tsx](src/pages/analytics/AnalyticsPage.tsx).
  - Widget components live in [src/components/widgets](src/components/widgets). To add/update charts, implement the UI component, add a service call in [src/api/analyticsApi.ts] (or create a new API file), and add unit/visual tests in `src/tests`.

- **Working Hours UI**:
  - UI and modal for working-hours live in [src/components/WorkingHoursModal.tsx] and related components.
  - Frontend API calls are in [src/api/WorkingHoursAPI.ts](src/api/WorkingHoursAPI.ts) and service helpers in [src/services/workingHoursService.ts].
  - To change the input or add validation, edit the modal component and update the service to match the backend serializers.

- **Workflow widgets (overall & per-workflow)**:
  - Workflow-specific widgets are under [src/components/widgets/workflow] and correspond to backend helpers at [Doc-Flow-Backend/analytics/services/widgets/workflow_widgets.py](../Doc-Flow-Backend/analytics/services/widgets/workflow_widgets.py).

- **Chatbot (UI)**:
  - Chat UI components are in [src/components/chatbot](src/components/chatbot) — see `ChatWidget.tsx`, `ChatInput.tsx`, and `ChatMessage.tsx` for the message flow.
  - The frontend calls the backend chatbot endpoints in [src/api/chatService.ts]. When changing prompts or payloads, coordinate with backend [chatbot/llm_service.py] to keep formats consistent.

### Running the frontend locally

```bash
cd DOC-Flow-Frontend-React
npm install
npm run dev
```

### Tests

Unit tests live in `src/tests`. Use `vitest` to run tests:

```bash
npm run test
```
