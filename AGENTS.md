🧠 LUTACO FRONTEND – AI AGENT RULES (FINAL – EXECUTABLE)
⚠️ EXECUTION PRIORITY (ABSOLUTE)

AI MUST:

READ package.json trước khi dùng thư viện
Nếu CHƯA có:
→ RETURN install command
→ STOP (ASK MODE)
Nếu ĐÃ có:
→ Dùng import (KHÔNG dùng CDN)
CDN chỉ dùng cho icon font (FontAwesome, etc.)
Validate output against rules (soft enforcement – không gây block execution)
NEVER fallback to chat nếu có thể sửa code
🔥 EXECUTION MODE (CRITICAL – FIX CORE ISSUE)
🟢 EDIT MODE (DEFAULT – ALWAYS)

AI MUST:

Sửa code trực tiếp vào file
KHÔNG giải thích
KHÔNG gửi code vào chat
KHÔNG mô tả solution
Trigger EDIT MODE khi:
User đưa code
User nói: fix / sửa / refactor / viết / implement
Task có thể thực thi
🟡 ASK MODE (STRICT)

Chỉ dùng khi:

Thiếu type (vi phạm MODEL RULE)
Không rõ requirement
Thiếu context quan trọng
Output:
Hỏi NGẮN GỌN
KHÔNG generate code
🔴 REFUSE MODE (LIMITED)

Chỉ khi:

Vi phạm kiến trúc nghiêm trọng
Ví dụ: gọi API trong component

❗ KHÔNG refuse vì thiếu context nhỏ

⚠️ ANTI-CHAT RULE (FIX TOKEN WASTE)
AI MUST NOT output full code in chat.

If in EDIT MODE:
→ Apply changes silently

If platform does not support direct edit:
→ Return MINIMAL patch format ONLY
→ NO full file dump
⚠️ SAFE EXECUTION (ANTI FREEZE)
If unsure:

1. Follow existing codebase
2. Then follow this document
3. NEVER stop execution
   ⚠️ RULE CONFLICT RESOLUTION
   Priority:
1. Existing project code
2. This document
3. Default Angular practice

DO NOT refuse immediately
⚠️ OUTPUT PROTOCOL (FIXED)
✅ Component
ng g c <correct-path>

Sau đó:

Sửa file trực tiếp
KHÔNG output code ra chat
✅ Non-component
Sửa trực tiếp file
KHÔNG dump code
❌ FORBIDDEN
Full code block trong chat
Giải thích dài dòng
"Here is updated code…"
🧱 PROJECT CONTEXT
Angular 17+ (standalone)
TypeScript
Hybrid Architecture (Core + Shared + Feature)
REST API
Multi-dev + AI environment
⚖️ CORE PRINCIPLES

1. Consistency > Creativity
   MUST follow existing patterns
   MUST NOT invent structure
2. Separation of Concerns

FORBIDDEN:

Component gọi API
Shared chứa business logic
Service chứa UI logic

3. Feature Isolation
   Không import chéo feature
   📁 FOLDER RESPONSIBILITY
   core/
   Singleton (auth, interceptor, guard)
   NO UI
   models/
   ONLY global model
   shared/
   ONLY UI component
   NO API
   NO business logic
   🏷 NAMING (STRICT)

Sai naming = INVALID

🔌 SERVICE RULE
ALL API qua service
NEVER dùng HttpClient trong component
🧠 MODEL RULE
Strong typing ONLY
NO any
Không rõ → ASK
🔄 DATA LAYER (CRITICAL)
Flow:
Service → Component → Template
DTO vs ViewModel (MANDATORY)
DTO: từ API
ViewModel: cho UI

❌ Cấm dùng DTO trong template

Mapping
Làm ở service / mapper
Component KHÔNG xử lý
Error Handling
Layer Responsibility
Service HTTP + normalize
Component UI state
Shared render

❌ Cấm throw raw error

⚡ ASYNC / STATE
Allowed:
RxJS
Signals
Rules:
KHÔNG subscribe trong template
Subscribe trong component
MUST unsubscribe / async pipe
Ownership:
Service: data
Component: UI state
Shared: stateless
🧾 FORM RULE
Reactive Forms ONLY
Validation trong component
Template chỉ hiển thị
🧩 COMPONENT ARCHITECTURE
MUST extend BaseComponent (list/detail)
KHÔNG reimplement loading/pagination
⚙️ ANGULAR RULES
standalone: true
OnPush
@if / @for / @switch
Keep @Input/@Output
customClass: string = ''
🚫 TEMPLATE RULE

❌ Cấm:

{{ complexLogic }}
🚀 PERFORMANCE
trackBy bắt buộc
tránh re-render
ưu tiên pure function
🎨 UI DESIGN (TAILWIND)
Primary: indigo
Success / Warning / Danger
Neutral: slate

❌ NO #000 / #fff

🧩 COMPONENT UI
Button / Input / Select / ...
MUST consistent behavior
🎯 ICON RULE
Dùng Font-based icon
Ưu tiên Font Awesome

❌ Không dùng SVG nếu có font

🛠 CLI ENFORCEMENT
ng g c <path>

❌ Cấm:

Tạo file tay
Sai naming
✅ FINAL VALIDATION (NON-BLOCKING)

Checklist:

Naming đúng
Không API trong component
Không logic trong template
Strong typing
Đúng Angular 17 syntax

❗ Nếu fail:
→ FIX → KHÔNG được dừng

🚨 FINAL RULE
If unsure:

1. Follow existing codebase
2. Then follow this document
3. NEVER stop execution
   ⚠️ RULE CONFLICT RESOLUTION
   Priority:
1. Existing project code
2. This document
3. Default Angular practice

DO NOT refuse immediately
⚠️ OUTPUT PROTOCOL (FIXED)
✅ Component
ng g c <correct-path>

Sau đó:

Sửa file trực tiếp
KHÔNG output code ra chat
✅ Non-component
Sửa trực tiếp file
KHÔNG dump code
❌ FORBIDDEN
Full code block trong chat
Giải thích dài dòng
"Here is updated code…"
🧱 PROJECT CONTEXT
Angular 17+ (standalone)
TypeScript
Hybrid Architecture (Core + Shared + Feature)
REST API
Multi-dev + AI environment
⚖️ CORE PRINCIPLES

1. Consistency > Creativity
   MUST follow existing patterns
   MUST NOT invent structure
2. Separation of Concerns

FORBIDDEN:

Component gọi API
Shared chứa business logic
Service chứa UI logic

3. Feature Isolation
   Không import chéo feature
   📁 FOLDER RESPONSIBILITY
   core/
   Singleton (auth, interceptor, guard)
   NO UI
   models/
   ONLY global model
   shared/
   ONLY UI component
   NO API
   NO business logic
   🏷 NAMING (STRICT)

Sai naming = INVALID

🔌 SERVICE RULE
ALL API qua service
NEVER dùng HttpClient trong component
🧠 MODEL RULE
Strong typing ONLY
NO any
Không rõ → ASK
🔄 DATA LAYER (CRITICAL)
Flow:
Service → Component → Template
DTO vs ViewModel (MANDATORY)
DTO: từ API
ViewModel: cho UI

❌ Cấm dùng DTO trong template

Mapping
Làm ở service / mapper
Component KHÔNG xử lý
Error Handling
Layer Responsibility
Service HTTP + normalize
Component UI state
Shared render

❌ Cấm throw raw error

⚡ ASYNC / STATE
Allowed:
RxJS
Signals
Rules:
KHÔNG subscribe trong template
Subscribe trong component
MUST unsubscribe / async pipe
Ownership:
Service: data
Component: UI state
Shared: stateless
🧾 FORM RULE
Reactive Forms ONLY
Validation trong component
Template chỉ hiển thị
🧩 COMPONENT ARCHITECTURE
MUST extend BaseComponent (list/detail)
KHÔNG reimplement loading/pagination
⚙️ ANGULAR RULES
standalone: true
OnPush
@if / @for / @switch
Keep @Input/@Output
customClass: string = ''
🚫 TEMPLATE RULE

❌ Cấm:

{{ complexLogic }}
🚀 PERFORMANCE
trackBy bắt buộc
tránh re-render
ưu tiên pure function
🎨 UI DESIGN (TAILWIND)
Primary: indigo
Success / Warning / Danger
Neutral: slate

❌ NO #000 / #fff

🧩 COMPONENT UI
Button / Input / Select / ...
MUST consistent behavior
🎯 ICON RULE
Dùng Font-based icon
Ưu tiên Font Awesome

❌ Không dùng SVG nếu có font

🛠 CLI ENFORCEMENT
ng g c <path>

❌ Cấm:

Tạo file tay
Sai naming
✅ FINAL VALIDATION (NON-BLOCKING)

Checklist:

Naming đúng
Không API trong component
Không logic trong template
Strong typing
Đúng Angular 17 syntax

❗ Nếu fail:
→ FIX → KHÔNG được dừng

🚨 FINAL RULE
If unsure:
→ Follow EXISTING CODEBASE
→ NOT your own idea
→ STILL EXECUTE (DO NOT FALLBACK TO CHAT)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ UI/UX QUALITY RULES (MANDATORY – KHÔNG ĐƯỢC BỎ QUA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛 UNIVERSAL COMPONENT DESIGN SYSTEM (LAW – ÁP DỤNG CHO MỌI COMPONENT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Đây là bộ quy tắc nền tảng. Khi tạo bất kỳ component mới nào
(datepicker, timepicker, color picker, autocomplete, stepper,
file upload, rating, tag input, transfer list, carousel, v.v.)
AI PHẢI tự suy ra behavior đúng từ các law dưới đây.
KHÔNG cần prompt lại cho từng component cụ thể.

────────────────────────────────────────────────────────
LAW 1 – MỌI COMPONENT PHẢI CÓ 5 TRẠNG THÁI
────────────────────────────────────────────────────────

Bất kỳ component tương tác nào PHẢI xử lý đủ 5 state:

default → Trạng thái bình thường, không tương tác
hover → Khi chuột di qua — visual feedback nhẹ
focus → Khi được focus (keyboard hoặc click) — ring rõ ràng
disabled → Opacity giảm, cursor not-allowed, không tương tác
error → Border/ring đỏ, message lỗi có animation

❌ KHÔNG được thiếu bất kỳ state nào trong số trên.
❌ KHÔNG được dùng cùng visual cho 2 state khác nhau.

────────────────────────────────────────────────────────
LAW 2 – QUY TẮC SHOW / HIDE (UNIVERSAL)
────────────────────────────────────────────────────────

Mọi element xuất hiện / biến mất PHẢI theo công thức:

ENTER = opacity(0→1) + transform(lệch nhỏ→gốc) + duration(150–300ms) + easing(ease-out-expo)
EXIT = opacity(1→0) + transform(gốc→lệch nhỏ) + duration(100–200ms) + easing(ease-in)

Lệch mặc định theo vị trí xuất hiện:
Từ dưới lên → translateY(8px) → translateY(0)
Từ trên xuống → translateY(-8px) → translateY(0)
Từ phải vào → translateX(12px) → translateX(0)
Scale popup → scale(0.95) → scale(1), transform-origin = điểm trigger

AI tự suy ra hướng phù hợp với UX của component đó.
Ví dụ: dropdown → từ dưới lên; tooltip top → từ dưới lên; notification → từ phải vào.

────────────────────────────────────────────────────────
LAW 3 – QUY TẮC OVERLAY / PANEL NỔI
────────────────────────────────────────────────────────

Mọi element "nổi" trên UI (dropdown, popover, tooltip, date panel,
color picker panel, autocomplete list, context menu, v.v.):

z-index:    phải cao hơn content — dùng z-[1000] đến z-[9999]
position:   absolute hoặc fixed, KHÔNG dùng relative làm panel nổi
shadow:     shadow-lg ring-1 ring-slate-900/5
background: bg-white
radius:     rounded-xl (12px) — nhất quán toàn app
border:     KHÔNG border nếu đã có ring + shadow
overflow:   hidden (clip nội dung bên trong theo radius)

Clickaway / outside click:
→ PHẢI đóng khi click ra ngoài
→ PHẢI đóng khi nhấn Escape
→ KHÔNG đóng khi click bên trong panel

Positioning logic:
→ Flip tự động nếu không đủ không gian (viewport collision detection)
→ Ưu tiên mở xuống, fallback mở lên
→ Ưu tiên căn trái trigger, fallback căn phải

────────────────────────────────────────────────────────
LAW 4 – QUY TẮC FEEDBACK TỨC THỜI
────────────────────────────────────────────────────────

Mọi thao tác user PHẢI có phản hồi visual trong vòng 100ms:

Click button → active scale(0.97) ngay lập tức
Select option → highlight ngay, KHÔNG delay
Toggle checkbox → trạng thái đổi ngay, animation song song
Input typing → character xuất hiện ngay, validation sau debounce 400ms
Hover bất kỳ → visual đổi trong 100–150ms, KHÔNG delay

Nếu action cần thời gian (API call, xử lý nặng):
→ Show loading state NGAY (< 16ms sau click)
→ KHÔNG để UI "đứng im" rồi mới hiện loading

────────────────────────────────────────────────────────
LAW 5 – QUY TẮC KEYBOARD & NAVIGATION
────────────────────────────────────────────────────────

Mọi component tương tác PHẢI keyboard accessible:

Tab / Shift+Tab → Di chuyển focus giữa các element
Enter / Space → Activate (button, checkbox, select...)
Escape → Đóng mọi overlay (modal, dropdown, dialog, panel)
Arrow keys → Navigate trong list/grid/calendar/slider
Home / End → Jump đến đầu / cuối list (nếu có list)

Focus order: theo DOM order, KHÔNG nhảy lung tung
Focus visible: ring-2 ring-indigo-500 ring-offset-2 — LUÔN LUÔN hiện

────────────────────────────────────────────────────────
LAW 6 – QUY TẮC SIZING & SPACING (SCALE CHUẨN)
────────────────────────────────────────────────────────

Height chuẩn của interactive element (input, select, button, trigger):
sm → h-8  (32px)
md → h-10 (40px) ← DEFAULT
lg → h-12 (48px)

Padding ngang tương ứng:
sm → px-3
md → px-4
lg → px-5

Nội tại component (khoảng cách icon ↔ text):
→ gap-2 (8px) — mọi component

Khoảng cách label ↔ control:
→ mb-1.5 (6px) — nhất quán

Khoảng cách control ↔ helper/error text:
→ mt-1.5 (6px) — nhất quán

AI tự áp scale này cho mọi component mới.
KHÔNG tự bịa ra sizing ngoài scale.

────────────────────────────────────────────────────────
LAW 7 – QUY TẮC MÀU SẮC (SELF-DERIVABLE)
────────────────────────────────────────────────────────

Từ semantic intent, AI tự suy ra màu:

primary → indigo-600 (action, CTA, selected, active)
success → emerald-500 (xác nhận, hoàn thành, valid)
warning → amber-500  (cảnh báo, cần chú ý)
danger → red-500    (lỗi, xóa, destructive)
info → sky-500    (thông tin trung tính)
neutral → slate-*    (text, border, background)

Quy tắc tự suy màu cho state:
Nền nhạt (bg)     → màu-50
Border / ring → màu-500
Text đậm → màu-700 hoặc màu-800
Icon → màu-500
Hover nền → màu-50
Active / selected → màu-100 text màu-700

Ví dụ: datepicker ngày được chọn → bg-indigo-600 text-white
ngày hôm nay (chưa chọn) → bg-indigo-50 text-indigo-700 font-semibold
ngày hover → bg-slate-100

────────────────────────────────────────────────────────
LAW 8 – QUY TẮC EMPTY / NULL / LOADING STATE
────────────────────────────────────────────────────────

Mọi component hiển thị data PHẢI xử lý đủ 3 trường hợp:

LOADING → Skeleton (animate-pulse) — KHÔNG spinner toàn vùng
EMPTY → Illustration đơn giản (FA icon lớn) + message ngắn + optional CTA
ERROR → Icon cảnh báo + message + nút retry

KHÔNG được để component trống trơn không có gì.
KHÔNG được dùng text "null", "undefined", "N/A" thô ra template.

────────────────────────────────────────────────────────
LAW 9 – QUY TẮC ICON TRONG COMPONENT
────────────────────────────────────────────────────────

Mọi component PHẢI dùng icon nhất quán:

Luôn dùng Font Awesome (fa-solid hoặc fa-regular)
Size icon khớp với text: text-sm→fa-sm, text-base→mặc định, text-lg→fa-lg
Icon màu inherit từ text hoặc chỉ định rõ ràng
Icon trạng thái:
loading → fa-spinner fa-spin
success → fa-circle-check
error → fa-circle-xmark
warning → fa-triangle-exclamation
info → fa-circle-info
close → fa-xmark
expand → fa-chevron-down (xoay 180deg khi mở)
calendar → fa-calendar-days
clock → fa-clock
search → fa-magnifying-glass
clear → fa-xmark (trong input)
eye → fa-eye / fa-eye-slash (password toggle)

AI tự áp icon phù hợp cho component mới mà không cần hỏi.

────────────────────────────────────────────────────────
LAW 10 – QUY TẮC TỰ SCALE CHO COMPONENT MỚI
────────────────────────────────────────────────────────

Khi gặp component chưa có rule cụ thể (datepicker, color picker,
rich text editor, OTP input, signature pad, v.v.):

AI PHẢI tự suy ra design theo thứ tự:

1. Nhìn existing component gần nhất trong codebase → bắt chước pattern
2. Áp LAW 1–9 ở trên
3. Panel nổi → LAW 3
4. Animation → LAW 2
5. State → LAW 1
6. Màu → LAW 7
7. Sizing → LAW 6
8. Icon → LAW 9
9. Keyboard → LAW 5
10. Feedback → LAW 4

❌ KHÔNG hỏi lại "bạn muốn datepicker trông như thế nào?"
❌ KHÔNG tạo component thiếu animation, thiếu state, thiếu keyboard support
✅ Tự quyết định → thực thi → nhất quán với hệ thống

⚠️ ANIMATION RULE (CRITICAL – FIX CURRENT ISSUE)

Mọi component hiển thị / ẩn đi PHẢI có transition animation.
KHÔNG được để element xuất hiện/biến mất tức thời (instant snap).
Đây là lỗi nghiêm trọng về UX.

Angular Animation MUST dùng: @angular/animations
Import BrowserAnimationsModule / provideAnimations() ở root.

❌ FORBIDDEN:

- *ngIf / @if không kèm animation trigger
- display:none toggle không có transition
- opacity toggle không có duration
- visibility toggle không có ease

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 TOAST / NOTIFICATION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTER animation (MANDATORY):

- Slide in từ phải hoặc từ trên xuống
- opacity: 0 → 1
- transform: translateX(100%) → translateX(0) hoặc translateY(-20px) → translateY(0)
- duration: 300ms
- easing: cubic-bezier(0.16, 1, 0.3, 1)  ← smooth overshoot

EXIT animation (MANDATORY):

- Slide out ngược chiều enter
- opacity: 1 → 0
- duration: 200ms
- easing: ease-in

AUTO DISMISS: 3000–5000ms tuỳ loại
Progress bar: hiển thị countdown (optional nhưng recommended)

Stack behavior:

- Nhiều toast → stack dọc, gap 8px
- Toast mới đẩy toast cũ lên / xuống với transition

Visual design MUST:

- Rounded: rounded-lg (8px)
- Shadow: shadow-lg
- Icon trái (FA): ✅ fa-circle-check / ⚠️ fa-triangle-exclamation / ❌ fa-circle-xmark / ℹ️ fa-circle-info
- Màu theo loại:
  success → bg-emerald-50, border-l-4 border-emerald-500, text-emerald-800
  error → bg-red-50, border-l-4 border-red-500, text-red-800
  warning → bg-amber-50, border-l-4 border-amber-500, text-amber-800
  info → bg-indigo-50, border-l-4 border-indigo-500, text-indigo-800
- Nút close (×) ở góc phải, hover highlight

Position: fixed, top-right (default): top-4 right-4, z-[9999]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🪟 MODAL / DIALOG RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKDROP animation (MANDATORY):

- opacity: 0 → 1
- duration: 200ms
- Màu: bg-slate-900/60 (backdrop-blur-sm nếu dùng được)

MODAL PANEL animation (MANDATORY):

- opacity: 0 → 1
- transform: scale(0.95) → scale(1)
- translateY(16px) → translateY(0)
- duration: 250ms
- easing: cubic-bezier(0.16, 1, 0.3, 1)

EXIT: reverse, duration 150ms

Scroll lock: MUST lock body scroll khi modal mở (overflow:hidden on body)
Focus trap: MUST trap focus bên trong modal
Đóng bằng: nút close, click backdrop, phím Escape

Visual design MUST:

- Rounded: rounded-xl (12px)
- Shadow: shadow-2xl
- Padding header: px-6 pt-6 pb-4
- Padding body: px-6 py-4
- Padding footer: px-6 pb-6 pt-2
- Divider giữa header / body / footer: border-t border-slate-100
- Max-width: sm=384px / md=512px / lg=640px / xl=768px
- Header: title (font-semibold text-slate-800) + close button (×)
- Footer: align-right, gap-3, primary action bên phải

Size variants: sm / md (default) / lg / xl / full

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔽 DROPDOWN / SELECT / POPOVER RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTER animation (MANDATORY):

- opacity: 0 → 1
- transform: scaleY(0.95) origin-top → scaleY(1)
- translateY(-4px) → translateY(0)
- duration: 150ms
- easing: ease-out

EXIT: reverse, duration 100ms

Visual design MUST:

- Rounded: rounded-lg
- Shadow: shadow-lg ring-1 ring-slate-900/5
- bg-white
- Item hover: bg-slate-50, transition-colors 100ms
- Item active/selected: bg-indigo-50 text-indigo-700 font-medium
- Max-height: 240px, overflow-y: auto, scrollbar-thin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 INPUT / FORM FIELD RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MỌI input PHẢI có:

- transition: border-color 150ms, box-shadow 150ms
- Default:  border border-slate-300 rounded-lg
- Focus:    border-indigo-500 ring-2 ring-indigo-500/20 ← glow effect
- Error:    border-red-500 ring-2 ring-red-500/15
- Disabled: bg-slate-50 text-slate-400 cursor-not-allowed opacity-60

Floating label (nếu dùng):

- Label animate lên khi focus hoặc có value
- transform + font-size transition, duration 150ms

Error message PHẢI:

- Xuất hiện với animation: opacity 0→1, translateY(-4px)→0, duration 200ms
- Màu: text-red-600, font-size: text-sm
- Icon ⚠ kèm message
- KHÔNG xuất hiện tức thời (snap)

Helper text: text-slate-500 text-sm, hiển thị dưới input

Character count (nếu có textarea): right-aligned, mờ, đổi màu khi gần limit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔘 BUTTON RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MỌI button PHẢI có:

- transition: all 150ms ease
- Hover: scale(1.01) hoặc background shift (không cả hai)
- Active: scale(0.98) — pressed feel
- Focus-visible: ring-2 ring-offset-2
- Disabled: opacity-50 cursor-not-allowed pointer-events-none

Loading state PHẢI có:

- Spinner icon (FA fa-spinner fa-spin) thay text
- HOẶC thêm spinner trái text
- Button disabled khi loading
- Width không được nhảy (giữ nguyên kích thước)

Variants (MANDATORY consistent):
primary → bg-indigo-600 hover:bg-indigo-700 text-white
secondary → bg-white border border-slate-300 hover:bg-slate-50 text-slate-700
danger → bg-red-600 hover:bg-red-700 text-white
ghost → bg-transparent hover:bg-slate-100 text-slate-600
link → text-indigo-600 underline-offset-4 hover:underline

Sizes: sm (h-8 px-3 text-sm) / md (h-10 px-4) / lg (h-12 px-6 text-base)
Icon-only button: MUST có aria-label, tooltip on hover

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂 TABLE / LIST RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Row hover: bg-slate-50, transition-colors 100ms
Row selected: bg-indigo-50 border-l-2 border-indigo-500
Row click: ripple hoặc scale(0.995) feedback

Skeleton loading (MANDATORY khi fetch):

- Dùng animated pulse: animate-pulse bg-slate-200 rounded
- KHÔNG dùng spinner toàn trang cho table
- Hiển thị 5–8 skeleton rows

Empty state PHẢI có:

- Icon (FA) + title + description + optional CTA button
- KHÔNG để bảng trống không có gì

Sort indicator: icon mũi tên, transition xoay khi đổi chiều
Pagination: previous/next + số trang, disabled state rõ ràng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 PAGE / ROUTE TRANSITION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route change PHẢI có:

- fadeIn: opacity 0→1, duration 200ms
- HOẶC slideUp: translateY(12px)→0 + opacity 0→1

Dùng Angular Router animation với routerTransition trigger
KHÔNG để trang flash trắng khi navigate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ LOADING STATE RULES (GLOBAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHÂN LOẠI loading (KHÔNG dùng cùng 1 kiểu cho mọi thứ):

Toàn trang (initial load):
→ Spinner full-screen hoặc logo animation
→ Fade out khi xong, duration 300ms

Section / widget:
→ Skeleton loading (animate-pulse)
→ KHÔNG spinner nhỏ lơ lửng

Button action:
→ Inline spinner trong button
→ KHÔNG overlay

Form submit:
→ Disabled + spinner trong submit button
→ KHÔNG block UI

Background refetch:
→ Subtle loading bar ở top (như NProgress)
→ KHÔNG hiện spinner lớn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 VISUAL POLISH RULES (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Spacing:

- KHÔNG dùng margin/padding lẻ tẻ khác nhau
- Dùng spacing scale chuẩn: 4/8/12/16/20/24/32/40/48px
- Section gap: 24px (mobile) / 32px (desktop)

Typography:

- Heading page: text-2xl font-bold text-slate-800
- Heading section: text-lg font-semibold text-slate-700
- Body: text-sm text-slate-600
- Muted: text-sm text-slate-400
- KHÔNG mix quá 2 font-weight trong 1 component

Border radius:

- Input / Button / Badge: rounded-lg (8px)
- Card / Modal / Dropdown: rounded-xl (12px)
- Avatar / Chip tròn: rounded-full
- KHÔNG mix rounded-md và rounded-lg trong cùng 1 component

Shadow system:

- Flat element: không shadow
- Card: shadow-sm
- Dropdown / Tooltip: shadow-lg ring-1 ring-slate-900/5
- Modal: shadow-2xl

Color usage:

- Text chính: text-slate-800
- Text phụ: text-slate-500
- Text mờ: text-slate-400
- Border: border-slate-200 (default) / border-slate-300 (prominent)
- Background page: bg-slate-50
- Background card: bg-white
- ❌ KHÔNG dùng text-gray-* (dùng slate-*)
- ❌ KHÔNG dùng #000 / #fff thuần

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
♿ ACCESSIBILITY (A11Y) – MINIMUM REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MỌI interactive element PHẢI có:

- focus-visible ring (KHÔNG outline:none trơn)
- aria-label nếu không có text hiển thị
- Keyboard navigable

Color contrast:

- Text trên background PHẢI đạt WCAG AA (4.5:1)
- KHÔNG để text mờ trên nền mờ

Modal / Dialog:

- aria-modal="true"
- aria-labelledby trỏ đến title
- Focus về trigger element khi đóng

Form:

- Label liên kết với input (for / id hoặc aria-labelledby)
- Error message: aria-describedby trỏ đến error text
- Required: aria-required="true"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 RESPONSIVE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Breakpoints (Tailwind default):
sm: 640px / md: 768px / lg: 1024px / xl: 1280px

Mobile-first MANDATORY:

- Viết class mobile trước, override ở md: lg:
- KHÔNG hardcode width px cho layout

Table responsive:

- Mobile: card view hoặc horizontal scroll wrapper (overflow-x-auto)
- KHÔNG để table bị vỡ layout

Modal responsive:

- Mobile: bottom sheet (slide up từ dưới) hoặc full screen
- Desktop: centered dialog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧩 MICRO-INTERACTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Badge / Chip: xuất hiện với scale(0.8)→scale(1) + opacity 0→1
Avatar: hover → ring-2 ring-indigo-400, transition 150ms
Checkbox / Toggle:

- Animated check / slide, KHÔNG snap
- Toggle: translateX transition, duration 200ms
  Accordion / Collapse:
- height: 0 → auto với transition (dùng Angular animation hoặc max-height trick)
- Chevron icon xoay 180deg khi mở
  Tab switching:
- Active indicator slide (translateX), KHÔNG jump
- Content fade in, duration 150ms
  Tooltip:
- Delay: 400ms (KHÔNG xuất hiện ngay)
- opacity 0→1, translateY(4px)→0, duration 150ms
- Arrow đúng hướng
  Number counter:
- Khi giá trị thay đổi: animate count up/down (optional nhưng recommended cho dashboard)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ANIMATION PERFORMANCE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHỈ animate các property không gây reflow:
✅ opacity
✅ transform (translate, scale, rotate)
❌ width / height (dùng transform:scaleX/Y thay thế)
❌ top / left / margin (dùng transform thay thế)
❌ background-color animate nếu danh sách dài

will-change: transform — chỉ dùng khi cần, KHÔNG dùng toàn bộ
prefer-reduced-motion: PHẢI wrap animation bằng @media (prefers-reduced-motion: reduce)
→ Khi user bật reduced motion: tắt transform, giữ opacity transition ngắn (100ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ANIMATION IMPLEMENTATION (ANGULAR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ưu tiên theo thứ tự:

1. Tailwind transition class (đơn giản nhất):
   transition-all duration-200 ease-out
   → Dùng cho hover, focus state

2. Angular Animations (@angular/animations):
   → Dùng cho show/hide component (toast, modal, dropdown)
   → trigger() + state() + transition() + animate()
   → PHẢI import trong component: animations: [myTrigger]

3. CSS @keyframes (qua styles.scss):
   → Dùng cho continuous animation (spinner, pulse, shimmer)
   → KHÔNG dùng cho show/hide logic

❌ FORBIDDEN:

- setTimeout để giả lập animation
- jQuery animate()
- Thay đổi style trực tiếp trong component để animate
- JS-driven frame loop cho UI animation

Easing chuẩn:

- Enter:  cubic-bezier(0.16, 1, 0.3, 1)   ← ease-out-expo (snappy)
- Exit:   cubic-bezier(0.5, 0, 0.75, 0)   ← ease-in-quart (quick)
- Hover:  ease-out, 150ms
- Layout: ease-in-out, 200ms

Duration chuẩn:

- Instant feedback (hover, focus): 100–150ms
- Show/Hide component: 200–300ms
- Page transition: 200ms
- Complex layout: 300–400ms
- ❌ KHÔNG dùng > 500ms trừ khi có lý do đặc biệt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ UI/UX VALIDATION CHECKLIST (NON-BLOCKING – FIX IF FAIL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mọi component trước khi done PHẢI pass:

[ ] Toast có enter + exit animation
[ ] Modal có backdrop fade + panel scale animation
[ ] Dropdown có enter + exit animation
[ ] Input có focus ring transition
[ ] Input error message có animation
[ ] Button có hover + active + loading state
[ ] Loading dùng đúng kiểu (skeleton / spinner / bar)
[ ] Không có element nào snap xuất hiện / biến mất tức thời
[ ] Responsive: không vỡ layout ở mobile
[ ] Keyboard navigable, focus-visible visible
[ ] Màu dùng đúng palette (slate, indigo, emerald, red, amber)
[ ] Spacing nhất quán theo scale
[ ] prefers-reduced-motion được xử lý

❗ Nếu fail bất kỳ điểm nào → FIX NGAY, KHÔNG skip
