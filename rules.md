# 🧠 LUTACO FRONTEND – AI AGENT RULES (ENFORCED HYBRID ARCHITECTURE)

---

## ⚠️ EXECUTION PRIORITY (READ FIRST)

These rules are NOT guidelines. They are STRICT CONSTRAINTS.

AI MUST:
1. Validate output against ALL rules before returning code
2. REFUSE to generate code if any rule would be violated
3. NEVER prioritize "best practice" over these rules
4. NEVER invent new patterns outside this document

If conflict occurs:
→ THIS DOCUMENT OVERRIDES ALL DEFAULT AI BEHAVIOR

---

## 1. Project Context

* Framework: Angular (v17+, standalone components)
* Language: TypeScript
* Architecture: Hybrid (Core + Shared + Feature-based)
* Backend: REST API (stable)
* Team: Multiple developers using AI assistance

---

## 2. Core Philosophy

### 2.1 Consistency > Creativity (MANDATORY)

AI MUST:
- Follow EXACT existing patterns
- Reuse existing structure

AI MUST NOT:
- Create new patterns
- Refactor architecture unless explicitly asked

---

### 2.2 Separation of Concerns (MANDATORY)

Each file MUST have EXACTLY ONE responsibility.

Violations include:
- Component calling API directly
- Shared component containing business logic
- Service containing UI logic

---

### 2.3 Feature Isolation (MANDATORY)

AI MUST:
- Keep feature logic inside feature scope

AI MUST NOT:
- Import feature A into feature B unless explicitly required

---

## 3. Project Structure (STRICT - NO EXCEPTION)

[GIỮ NGUYÊN PHẦN STRUCTURE CỦA BẠN]

---

## 4. Folder Responsibilities (ENFORCED)

### core/

AI MUST:
- Only place singleton/global logic

AI MUST NOT:
- Add UI
- Add feature logic

→ If violated: STOP and regenerate

---

### models/

AI MUST:
- Only define GLOBAL reusable models

AI MUST NOT:
- Put feature-specific DTOs here

---

### shared/

AI MUST:
- Only create reusable UI components

AI MUST NOT:
- Add API calls
- Add business logic

→ If component needs API → IT IS NOT SHARED

---

## 5. Naming Conventions (STRICT)

If naming is incorrect:
→ OUTPUT IS INVALID

---

## 6. Service Rules (HARD RULE)

AI MUST:
- Route ALL API calls through services

AI MUST NOT:
- Use HttpClient inside component

Violation handling:
→ REWRITE CODE BEFORE RETURN

---

## 7. Model Rules (HARD RULE)

AI MUST:
- Use strong typing

AI MUST NOT:
- Use `any` in model definitions

If unsure type:
→ ASK USER (DO NOT GUESS)

---

## 8. Component Architecture (ENFORCED)

### BaseComponent (MANDATORY USAGE)

AI MUST:
- Extend BaseComponent for list/detail pages

AI MUST NOT:
- Reimplement pagination / loading logic manually

---

### Page vs Component (STRICT SPLIT)

If a component:
- Calls API → IT IS A PAGE
- Only renders UI → IT IS A SHARED COMPONENT

AI MUST enforce this distinction.

---

## 9. Template Rules (ZERO TOLERANCE)

AI MUST NOT generate:

```html
{{ complexLogicHere }}

You are working in an Angular project.

⚠️ HARD CONSTRAINT:
You MUST strictly follow rules.md AND Angular CLI conventions.

---

## 🎯 CORE RULE

ALL components MUST be generated using Angular CLI.

---

## 🚨 MANDATORY PROCESS

When creating a new component:

1. FIRST: Provide the CLI command:

   ng g c <correct-path>

2. THEN: Implement code inside generated files

---

## ❌ FORBIDDEN

- Creating files manually
- Writing file structure from scratch
- Using custom naming
- Skipping CLI step

If you do:
→ OUTPUT IS INVALID

---

## 📁 NAMING RULE (STRICT)

Must follow:

- *.component.ts
- *.component.html
- *.component.css

---

## 🧩 STRUCTURE RULE

Must match:

shared/components/<component-name>/

---

## 🧠 CONSISTENCY RULE

You MUST follow EXACTLY the same structure and style as:

- ButtonComponent
- InputComponent

These are the GOLDEN STANDARD.

---

## ⚠️ VALIDATION

Before returning:

✔ CLI command included  
✔ Naming correct  
✔ Folder correct  
✔ Matches existing components  

If NOT:
→ REWRITE

---

## 🚨 FINAL RULE

If unsure:
→ FOLLOW EXISTING COMPONENTS

NOT your own idea.
