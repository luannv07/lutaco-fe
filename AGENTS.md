LUTACO FRONTEND — AI AGENT RULES v4.0
Angular 17+ · TypeScript · Tailwind CSS · Standalone · Clean Code · Token-Efficient
=============================================================================

## CONFLICT RESOLUTION PRIORITY

1. Existing codebase 2. This document 3. Angular defaults
   → Never stop execution. Never refuse on minor missing context.

=============================================================================

## 01 · EXECUTION MODE

🟢 EDIT MODE (DEFAULT)
Trigger: code provided, or fix/refactor/implement/write, or any executable task.
→ Edit file directly. No chat explanation. No full code dump.

🟡 ASK MODE (STRICT)
Trigger: type missing (MODEL RULE), requirement truly ambiguous, critical context absent.
→ Ask ONE short question. No code generated.

🔴 REFUSE (RARE)
Trigger: severe architecture violation only (e.g. HttpClient inside Component).
→ Never refuse on minor missing context.

OUTPUT PROTOCOL:

- Component → ng g c , then edit file directly. No dump to chat.
- Non-component → edit file directly.
- FORBIDDEN: full code block in chat, preambles, long explanations, "Here is updated code…"

LIBRARY RULE:

- Read package.json before using any library.
- Missing → return install command → stop (ASK MODE).
- Present → use import. CDN only for icon fonts (FontAwesome).

PRIORITY: (1) Existing codebase → (2) This document → (3) Angular defaults.
NEVER stop execution. NEVER fall back to chat instead of action.

=============================================================================

## 02 · ARCHITECTURE & FOLDER RULES

core/ → Singleton services, auth, interceptors, guards. NO UI.
shared/ → UI-only components. NO API. NO business logic. Stateless.
models/ → Global types only.
feature/ → Fully isolated. No cross-feature imports.

RULES:

- NEVER: HttpClient in Component, business logic in Shared, UI logic in Service, cross-feature imports.
- ALWAYS: ng g c CLI. Wrong naming = INVALID.

=============================================================================

## 03 · DATA LAYER

Flow: Service → Component → Template

DTO → from API. Mapped to ViewModel in Service/Mapper. Never in template directly.
Errors: Service normalizes HTTP. Component manages UI state. Never throw raw errors.
Async: RxJS or Signals. Never subscribe in template. Always unsubscribe or async pipe.
Service owns: data. Component owns: UI state. Shared: stateless.
Forms: Reactive Forms only. Validation in component. Template renders only.
Types: Strong typing only. No `any`. Unclear → ASK first.

=============================================================================

## 04 · ANGULAR 17+ RULES

- standalone: true + ChangeDetectionStrategy.OnPush on every component.
- Use @if / @for / @switch. `track` required in every @for.
- Extend BaseComponent for list/detail. Never reimplement loading/pagination.
- Keep @Input() / @Output(). Add `customClass: string = ''` on every component.
- FORBIDDEN: complex logic in templates ({{ complexLogic() }}).
- Root must have provideAnimations().

=============================================================================

## 05 · UI/UX DESIGN LAWS (UNIVERSAL)

Auto-apply to every component. Never ask "what should it look like?". Execute immediately.

LAW 01 — 5 STATES REQUIRED
Every interactive component: default · hover · focus · disabled · error.
All 5 mandatory. No two states share same visual.

LAW 02 — SHOW/HIDE ANIMATION
Enter: opacity(0→1) + transform(offset→origin), 150–300ms, ease-out-expo.
Exit: opacity(1→0) + transform reverse, 100–200ms, ease-in.
Offsets: below=translateY(8px), above=translateY(-8px), right=translateX(12px), popup=scale(0.95).
NEVER instant snap. Use @angular/animations for all show/hide.

LAW 03 — FLOATING PANELS
z-[1000]+, rounded-xl, shadow-lg ring-1 ring-slate-900/5, bg-white, overflow-hidden.
Close: Escape + clickaway (never on click inside). Auto-flip vertically if no space below.

LAW 04 — INSTANT FEEDBACK
Every action → visual response <100ms. Loading shows <16ms after click. UI never freezes silently.

LAW 05 — KEYBOARD NAVIGATION
Tab/Shift+Tab · Enter/Space · Escape (closes all overlays) · Arrows · Home/End.
Focus ring always: ring-2 ring-indigo-500 ring-offset-2. Never outline:none alone.

LAW 06 — SIZING SCALE
sm=h-8 px-3 / md=h-10 px-4 (DEFAULT) / lg=h-12 px-5.
Icon↔text: gap-2. Label↔control: mb-1.5. Control↔helper: mt-1.5. Never invent sizes outside scale.

LAW 07 — COLOR SYSTEM
Primary: indigo | Success: emerald | Warning: amber | Danger: red | Neutral: slate.
FORBIDDEN: #000, #fff, gray-_ (always slate-_).

LAW 08 — EMPTY/LOADING/ERROR STATES
Loading → skeleton (animate-pulse). Never full-page spinner for sections.
Empty → FA icon (large) + message + optional CTA.
Error → warning icon + message + retry. Never blank.

LAW 09 — ICONS
Font Awesome always. Never SVG if FA equivalent exists.
fa-spinner fa-spin · fa-circle-check · fa-circle-xmark · fa-triangle-exclamation ·
fa-circle-info · fa-xmark · fa-chevron-down (rotate 180 open) · fa-calendar-days ·
fa-magnifying-glass · fa-eye / fa-eye-slash.

LAW 10 — SELF-DERIVE FOR UNKNOWN COMPONENTS
Find nearest existing component → replicate pattern → apply LAW 1–9.
Never ask "how should this look?". Execute immediately.

MICRO-INTERACTIONS (mandatory):

- Badge/Chip: scale(0.8)→scale(1) + opacity 0→1
- Avatar hover: ring-2 ring-indigo-400, 150ms
- Checkbox/Toggle: animated (never snap). Toggle: translateX 200ms.
- Accordion: height 0→auto, chevron rotates 180deg.
- Tab indicator: translateX slide (never jump). Content fade in 150ms.
- Tooltip: 400ms delay, opacity 0→1 + translateY(4px)→0, 150ms.
- Route transitions: fadeIn 200ms OR slideUp translateY(12px)+opacity. Never white flash.

VISUAL POLISH:
Spacing scale: 4/8/12/16/20/24/32/40/48px. Section gap: 24px mobile / 32px desktop.
Typography: page=text-2xl font-bold text-slate-800, section=text-lg font-semibold text-slate-700,
body=text-sm text-slate-600, muted=text-sm text-slate-400. Max 2 font-weights per component.
Radius: input/button/badge=rounded-lg · card/modal/dropdown=rounded-xl · avatar=rounded-full.
Shadow: flat=none · card=shadow-sm · dropdown/tooltip=shadow-lg ring-1 · modal=shadow-2xl.

PRE-DELIVERY CHECKLIST — fail any → fix immediately:
[ ] Toast: enter + exit animation
[ ] Modal: backdrop fade + panel scale
[ ] Dropdown: animates open/close
[ ] Input: focus ring transition
[ ] Input error: animates in (no snap)
[ ] Button: hover + active + loading state
[ ] Loading type correct (skeleton / inline-spinner / top-bar)
[ ] Nothing appears or disappears instantly
[ ] Mobile: no layout breaks
[ ] Keyboard nav + focus-visible always shown
[ ] Colors from palette only (slate, indigo, emerald, red, amber, sky)
[ ] Spacing from scale only
[ ] prefers-reduced-motion handled
[ ] No #000 / #fff / gray-\*

=============================================================================

## 06 · TOAST / NOTIFICATION

ENTER: translateX(100%)→0 + opacity 0→1, 300ms, cubic-bezier(0.16,1,0.3,1).
EXIT: reverse, 200ms, ease-in. Auto-dismiss 3–5s. Optional progress bar countdown.
Stack: gap-2, new toast pushes others with transition.
Position: fixed top-4 right-4 z-[9999]. Style: rounded-lg shadow-lg border-l-4. FA icon left. Close × top-right.
success → bg-emerald-50 border-emerald-500 text-emerald-800 fa-circle-check
error → bg-red-50 border-red-500 text-red-800 fa-circle-xmark
warning → bg-amber-50 border-amber-500 text-amber-800 fa-triangle-exclamation
info → bg-indigo-50 border-indigo-500 text-indigo-800 fa-circle-info

=============================================================================

## 07 · MODAL / DIALOG

BACKDROP: opacity 0→1, 200ms, bg-slate-900/60 backdrop-blur-sm.
PANEL: opacity 0→1 + scale(0.95)→1 + translateY(16px)→0, 250ms, cubic-bezier(0.16,1,0.3,1). Exit 150ms.
REQUIRED: lock body scroll, trap focus, restore focus to trigger on close.
CLOSE: × button + backdrop click + Escape.
STYLE: rounded-xl shadow-2xl. Header px-6 pt-6 pb-4. Body px-6 py-4. Footer px-6 pb-6 pt-2. Dividers border-t border-slate-100.
SIZES: sm=384px · md=512px (default) · lg=640px · xl=768px · full.
MOBILE: bottom sheet (slide up) or full-screen.
A11Y: aria-modal="true" · aria-labelledby→title. Footer: right-aligned gap-3, primary action rightmost.

=============================================================================

## 08 · DROPDOWN / SELECT / POPOVER

ENTER: opacity 0→1 + scaleY(0.95) origin-top + translateY(-4px)→0, 150ms ease-out.
EXIT: reverse, 100ms.
STYLE: rounded-lg shadow-lg ring-1 ring-slate-900/5 bg-white max-h-60 overflow-y-auto scrollbar-thin.
ITEMS: hover=bg-slate-50 100ms. active=bg-indigo-50 text-indigo-700 font-medium.
CLOSE: Escape + clickaway + item select. Never close on click inside. Auto-flip if no space below.

=============================================================================

## 09 · INPUT / FORM FIELD

States (transition: border-color 150ms, box-shadow 150ms):
default → border border-slate-300 rounded-lg
focus → border-indigo-500 ring-2 ring-indigo-500/20
error → border-red-500 ring-2 ring-red-500/15
disabled → bg-slate-50 text-slate-400 cursor-not-allowed opacity-60

Error message: animate opacity 0→1 + translateY(-4px)→0, 200ms. text-red-600 text-sm + ⚠ FA icon. aria-describedby linked. Never snap.
Validation: debounce 400ms on typing. Instant on blur/submit.
Extras: floating label transition 150ms. Textarea char count: right-aligned, color-shifts near limit. Helper: text-slate-500 text-sm mt-1.5.

=============================================================================

## 10 · BUTTON

Base: transition all 150ms · hover scale(1.01) or bg-shift (not both) · active scale(0.98) ·
focus-visible ring-2 ring-offset-2 · disabled opacity-50 pointer-events-none.
Loading: fa-spinner fa-spin. Button disabled. Width stays fixed.
Variants:
primary → bg-indigo-600 hover:bg-indigo-700 text-white
secondary → bg-white border border-slate-300 hover:bg-slate-50 text-slate-700
danger → bg-red-600 hover:bg-red-700 text-white
ghost → bg-transparent hover:bg-slate-100 text-slate-600
link → text-indigo-600 underline-offset-4 hover:underline
Sizes: sm=h-8 px-3 text-sm · md=h-10 px-4 (default) · lg=h-12 px-6 text-base.
Icon-only: aria-label + tooltip on hover.

=============================================================================

## 11 · TABLE / LIST

Row hover: bg-slate-50 100ms. Selected: bg-indigo-50 border-l-2 border-indigo-500.
Loading: 5–8 skeleton rows (animate-pulse). Never full-page spinner.
Empty: FA icon (large) + title + description + optional CTA. Never blank.
Sort: arrow icon, rotates on direction change. Pagination: clear disabled states.
Mobile: card view or overflow-x-auto wrapper.

=============================================================================

## 12 · LOADING TYPES

Full page → full-screen spinner, fade out 300ms on complete.
Section → skeleton animate-pulse.
Button → inline spinner in button. Never overlay.
Form submit → disabled + spinner in submit button.
Background → subtle top progress bar (NProgress-style).

=============================================================================

## 13 · ANIMATION IMPLEMENTATION

Priority: (1) Tailwind transitions (hover/focus) → (2) @angular/animations (show/hide) → (3) CSS @keyframes (continuous).
FORBIDDEN: setTimeout to fake animation · jQuery · direct style mutation · JS frame loop.

Easing: enter=cubic-bezier(0.16,1,0.3,1) · exit=cubic-bezier(0.5,0,0.75,0) · hover=ease-out 150ms.
Duration: hover 100–150ms · show/hide 200–300ms · page 200ms. Never >500ms.
Animate ONLY: opacity + transform. NEVER: width, height, top, left, margin.
prefers-reduced-motion: remove transforms, keep opacity ≤100ms.

=============================================================================

## 14 · A11Y & RESPONSIVE

A11Y:

- Every interactive element: focus-visible ring + aria-label if no visible text + keyboard navigable.
- WCAG AA contrast (4.5:1). Never light text on light background.
- Modal: aria-modal="true" · aria-labelledby→title · restore focus on close.
- Form: label linked · error aria-describedby · aria-required="true".

RESPONSIVE:

- Mobile-first. Write mobile classes first, override at md:/lg:. Never hardcode px widths for layout.
- Breakpoints: sm=640px · md=768px · lg=1024px · xl=1280px.
- Table mobile: card view or overflow-x-auto. Modal mobile: bottom sheet or full-screen.

=============================================================================

## 15 · CLEAN CODE RULES

Code is written once, read 100 times. Write for the next developer.

NAMING:

- Variables: reveal intent. isLoading, hasError, selectedUser. NOT: flag, temp, data, x.
- Functions: verb + noun. loadUserList(), handleSubmit(), formatCurrency(). NOT: process(), doStuff().
- Classes/Components: noun PascalCase. UserProfileComponent, WalletService. NOT: Manager, Handler (vague).
- Constants: UPPER_SNAKE_CASE. MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE. Always typed, never magic numbers.

FUNCTIONS:

- One function = one job. If you need "and" to describe it → split it.
- Max ~20 lines. Longer → extract helpers. Max 100 chars/line.
- Max 3 params. More → use an interface/object.
- NEVER: side effects inside a getter function. getUser() must not modify state.
- NEVER: magic numbers/strings inline. Extract to named const.

STRUCTURE & DRY:

- Logic used twice → extract to function/service/pipe. Never copy-paste logic.
- Fail fast. Return early for edge cases. Avoid deep nesting.
- Prefer pure functions: same input → same output. No hidden dependencies.
- Prefer const. Never mutate input params. Return new objects/arrays.
- NEVER: commented-out code in commits. Delete it (git has history).
- NEVER: console.log in production code (except intentional logout placeholders).

COMMENTS — write WHY, not WHAT:

- Bad: // multiply by 1.1 → const total = price \* 1.1;
- Good: // VAT 10% required by VN tax law → const total = price \* VAT_RATE;
- Self-explanatory code needs no comment.

ANGULAR-SPECIFIC:

- Component: max 200 lines. Extract complex logic to service/helper.
- Template: max 100 lines. Extract repeated blocks to child components.
- Pipes for display transformation. Never transform data inline in template.
- One component per file. One responsibility per component.
- NEVER: nested subscribes. Use switchMap / combineLatest / forkJoin.
- NEVER: `any`. Use `unknown` + type guard if type is truly unknown.

=============================================================================

## 16 · TOKEN ECONOMY RULES

Every token must earn its place. No filler. No ceremony. Just code.

RESPONSE FORMAT:
FORBIDDEN outputs:

- "Here is the updated component..."
- "Great question! Let me explain..."
- "I have made the following changes:"
- Full file dump when only 5 lines changed
  REQUIRED:
- Edit silently in EDIT MODE.
- Output ONLY the changed block + 3–5 lines of surrounding context (patch format).
- If confirmation useful: max 1 sentence. "Done — extracted to UserMapper."

THINKING — DO ONCE, ACT FAST:

- Analyze → plan → execute in one pass. No back-and-forth unless truly blocked.
- 80% certain of intent → proceed with best assumption, note it in 1 line.
- NEVER ask clarifying questions the codebase or context already answers.
- NEVER generate both options and ask which. Pick the right one and execute.

CODE GENERATION ECONOMY:

- Before generating new code: check if existing utility/service/pipe already handles it.
- Only generate what was asked. No bonus features, no unsolicited refactors.
- Only add imports for what you actually use. Remove unused imports immediately.
- NEVER generate boilerplate not needed for the task.
- NEVER duplicate logic. Extract shared logic, reference once.

CHAT DISCIPLINE:
BAD (wastes tokens):
"Great! I've analyzed your component and here are the changes I made:

1. Removed the ngIf directive 2. Added @if syntax 3. Updated imports.
   Here is the full updated file: [500 lines]"

GOOD (efficient):
[edit applied]
// Changed \*ngIf → @if (Angular 17 syntax)

ERROR HANDLING ECONOMY:

- Trivial bug found while doing another task → fix silently (<5 lines), note in 1 line.
- Need more context → ask ONE specific question. Not a list.
- NEVER stop to explain why you stopped. Either fix it or ask the minimum to continue.

=============================================================================

## 17 · SIDEBAR COMPONENT SPEC

Files:
menu.config.ts → { label: string, icon: string, route: string }[]
sidebar.component.ts → standalone, imports RouterLink + RouterLinkActive

Layout: fixed left · w-64 · h-screen · bg-slate-900 · text-white · flex flex-col

TOP: h-16 · centered brand name · border-b border-slate-700
MIDDLE: flex-1 · overflow-y-auto · @for on config array (never hardcoded HTML)
Item: · rounded-lg · px-3 py-2 · flex items-center gap-3
Hover: bg-slate-800, transition 150ms
Active: routerLinkActive → bg-indigo-600 text-white
BOTTOM: border-t border-slate-700
Logout: fa-right-from-bracket · text-red-400 · hover:bg-slate-800
logout(): console.log('Logout...') — wire to AuthService later

Menu:
{ label: 'Overview', icon: 'fa-chart-pie', route: '/dashboard' }
{ label: 'Profile', icon: 'fa-user', route: '/me' }
{ label: 'Wallets', icon: 'fa-wallet', route: '/wallets' }
{ label: 'Transactions', icon: 'fa-money-bill-transfer', route: '/transactions' }

Verify routes match app.routes.ts after generation.

=============================================================================
FINAL RULE: existing codebase → this document → Angular defaults.
NEVER stop. NEVER explain instead of doing.
Section 15 — Clean Code bao gồm: naming conventions có ví dụ bad/good, function rules (single responsibility, max 20 lines, max 3 params), DRY + early return + immutability, comment philosophy (WHY not WHAT), và Angular-specific rules (max 200 lines/component, no nested subscribes, no any).
Section 16 — Token Economy bao gồm: forbidden response patterns ("Here is the updated code..."), patch-only format, think-once-act-fast rule, code generation scope control, và chat discipline với example bad vs good output cụ thể.
Codex will review your output once you are done.
nói ngắn gọn, ko giải thích, ko hỏi lại, chỉ code.
Tận dụng tối đa tailwind, hạn chế việc dùng css thuần
