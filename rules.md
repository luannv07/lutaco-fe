# 🧠 LUTACO FRONTEND – AI AGENT RULES (HYBRID ARCHITECTURE)

---

## 1. Project Context

*   Framework: Angular (v17+, standalone components)
*   Language: TypeScript
*   Architecture: Hybrid (Core + Shared + Feature-based)
*   Backend: REST API (stable)
*   Team: Multiple developers using AI assistance

---

## 2. Core Philosophy

### 2.1 Consistency > Creativity

*   ALWAYS follow existing structure and patterns
*   DO NOT invent new architecture or folder structures
*   Prefer simple, predictable code

---

### 2.2 Separation of Concerns

*   UI logic, business logic, and data access MUST be separated
*   Each file has ONE responsibility

---

### 2.3 Feature Isolation

*   Each feature (e.g., authentication, user management) is self-contained
*   DO NOT mix logic between features

---

## 3. Project Structure (STRICT)

```plaintext
src/app/
│
├── core/                    # GLOBAL (singleton, system-wide)
│   ├── i18n/                # Language services and loaders
│   │   ├── language.service.ts
│   │   └── translation-loader.service.ts
│   ├── interceptors/        # HTTP interceptors (e.g., auth.interceptor.ts)
│   │   └── auth.interceptor.ts
│   └── services/            # Base services (e.g., base.service.ts)
│       └── base.service.ts
│
├── models/                  # GLOBAL Models (BaseResponse, Page, etc.)
│   ├── base-response.ts
│   └── page.ts
│
├── shared/                  # REUSABLE UI ELEMENTS & UTILITIES
│   ├── components/          # Reusable UI components
│   │   ├── base/            # Base component for common logic
│   │   │   └── base.component.ts
│   │   └── input/           # Example: input component
│   │       └── input.css
│   ├── constants/           # Global constants (e.g., API endpoints)
│   │   └── api.constants.ts
│   └── base-imports.ts      # Barrel file for common Angular imports
│
├── environments/            # Environment-specific configurations
│   ├── environment.ts
│   └── environment.prod.ts
│
├── app.config.ts            # Application configuration (providers, i18n setup)
├── app.routes.ts            # Main application routes
├── app.ts                   # Root component
├── app.css                  # Root component styles
├── app.html                 # Root component template
└── ... (other app-level files)
│
├── assets/
│   └── i18n/                # Internationalization files
│       ├── en/
│       │   ├── common.json
│       │   └── auth.json
│       └── vi/
│           ├── common.json
│           └── auth.json
│
├── main.ts                  # Application entry point (includes 'zone.js' import)
├── styles.css               # Global styles
└── ... (other root files like angular.json, vite.config.ts, package.json)
```

---

## 4. Folder Responsibilities

### 4.1 core/

Contains ONLY global, singleton logic:

*   API base service (`base.service.ts`)
*   Authentication interceptors (`auth.interceptor.ts`)
*   Internationalization services (`language.service.ts`, `translation-loader.service.ts`)

❌ MUST NOT contain:

*   Business/feature-specific logic
*   UI components

---

### 4.2 models/

Contains ONLY global data models:

*   Standardized API response (`base-response.ts`)
*   Pagination structure (`page.ts`)
*   Any other models used across multiple features or core functionalities.

❌ MUST NOT contain:

*   Business/feature-specific models (these should be in feature folders)

---

### 4.3 shared/

Contains reusable UI elements and utilities:

*   Base components (`base.component.ts`)
*   Reusable UI components (e.g., `input/`)
*   Global constants (`api.constants.ts`)
*   Common Angular imports (`base-imports.ts`)

❌ MUST NOT contain:

*   API calls
*   Business logic
*   Feature-specific components

---

### 4.4 environments/

Contains environment-specific configuration files:

*   `environment.ts` (development)
*   `environment.prod.ts` (production)

---

## 5. Naming Conventions

### Files

*   kebab-case
*   Example:
    *   `base.service.ts`
    *   `auth.interceptor.ts`

### Classes

*   PascalCase
*   Example:
    *   `BaseService`
    *   `AuthInterceptor`

### Variables

*   camelCase

### i18n Keys

*   camelCase (e.g., `common.buttons.save`)

---

## 6. Service Rules

### 6.1 General

*   ALL API calls MUST go through services
*   DO NOT call HttpClient directly in components

---

### 6.2 Base Service (MANDATORY)

Located at: `src/app/core/services/base.service.ts`

Responsibilities:

*   Wrap HttpClient
*   Provide common CRUD methods: `create`, `getDetail`, `search`, `update`, `deleteById`
*   Return `Observable<BaseResponse<any>>` or `Observable<BaseResponse<Page<any>>>`

---

## 7. Model Rules

### 7.1 Global Models

Located in: `src/app/models/`

Example:

*   `BaseResponse`
*   `Page`

Rules:

*   Match backend DTOs
*   Strong typing required

❌ NEVER use: `any` (for model definitions themselves)

---

## 8. Component Architecture

### 8.1 BaseComponent (MANDATORY)

Located at: `src/app/shared/components/base/base.component.ts`

Responsibilities:

*   Abstract class for common logic in list/detail pages.
*   Manages `loading`, `isSubmitting`, `isEditMode` states.
*   Handles `searchForm` and `detailForm` initialization and submission.
*   Provides methods for `search`, `submit` (create/update), `deleteItem`.
*   Includes pagination (`currentPage`, `itemsPerPage`, `totalPages`) and sorting (`sortField`, `sortDirection`) logic.
*   Manages item selection (`selectedItems`, `selectAll`).
*   Integrates i18n (`TranslateService`, `LanguageService`) and listens for language changes.
*   Provides lifecycle hooks (`onBeforeSearch`, `onAfterSubmit`, etc.) for child customization.

---

### 8.2 Page vs Component

| Type      | Responsibility                   |
| :-------- | :------------------------------- |
| Page      | Handle API, state, orchestration |
| Component | UI only (Input/Output)           |

---

## 9. Template Rules (CRITICAL)

❌ DO NOT:

```html
{{ items.filter(x => x.active).length }}
```

✅ DO:

```ts
//activeItems = this.items.filter(...)
```

---

## 10. State Management

*   Use:
    *   Angular Signals OR RxJS
*   Keep state LOCAL to page

❌ DO NOT:

*   Introduce NgRx unless explicitly required

---

## 11. Styling Rules

*   Use consistent styling system (Tailwind or SCSS)
*   Avoid inline styles
*   Reuse shared components

---

## 12. AI CODING RULES (VERY IMPORTANT)

When generating code, AI MUST:

1.  Read existing structure before writing code
2.  Place files in correct folders (`core/`, `shared/`, `models/`, `environments/`)
3.  Follow naming conventions strictly
4.  Reuse existing services/components if available
5.  Keep code minimal and consistent
6.  Respect Page vs Component separation
7.  Use strong typing (NO `any` in model definitions)

---

## 13. AI MUST NOT DO

*   ❌ Create new root-level folders (unless explicitly instructed for build config like `vite.config.ts`)
*   ❌ Put business/feature logic into `core/`
*   ❌ Put business/feature logic into `shared/`
*   ❌ Duplicate services
*   ❌ Write logic inside HTML
*   ❌ Mix multiple responsibilities

---

## 14. Build Configuration

*   **`main.ts`**: MUST include `import 'zone.js';`
*   **`angular.json`**:
    *   `"polyfills": ["zone.js"]` must be present in build options.
    *   `"allowedCommonJsDependencies": ["zone.js"]` must be present in build options.
*   **`vite.config.ts`**: MUST `exclude: ['zone.js']` from `optimizeDeps`.

---

## 15. Internationalization (i18n)

*   **Structure**: `src/assets/i18n/{lang}/{moduleName}.json` (e.g., `en/common.json`, `vi/auth.json`)
*   **`TranslationLoaderService`**: Custom loader to handle modular translation files.
*   **`LanguageService`**: Manages current language, stores preference, and loads translation modules.
*   **`auth.interceptor.ts`**: Automatically adds `Accept-Language` header to API requests.
*   **`BaseComponent`**: Listens for language changes and provides hooks for data reload.
*   **Keys**: All i18n keys MUST be `camelCase`.

---

## 16. Communication Rule

If unclear:

*   DO NOT guess
*   ASK for clarification

---

# ✅ FINAL PRINCIPLE

> FOLLOW STRUCTURE → KEEP CONSISTENT → AVOID CREATIVITY
